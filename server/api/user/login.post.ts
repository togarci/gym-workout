import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { scryptSync, timingSafeEqual } from 'crypto';
import jwt from 'jsonwebtoken';
import type { H3Event } from 'h3';

const config = useRuntimeConfig();

const adapter = new PrismaPg({ connectionString: String(config.public.databaseUrl) });
const prisma = new PrismaClient({ adapter });

const SEVEN_DAYS_IN_SECONDS = 60 * 60 * 24 * 7;
const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30;

/** Lê e valida as credenciais e o tipo de acesso (`personal`) enviados no corpo da requisição. */
async function getCredentials(event: H3Event) {
  const body = await readBody(event);
  const { userName, password, personal } = body;

  if (!userName || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Email/userName e password são obrigatórios.',
    });
  }

  return {
    userName: String(userName),
    password: String(password),
    isPersonal: personal === true,
  };
}

/** Busca o usuário pelo userName, já com role e perfis (personal/global). */
async function findUserByUserName(userName: string) {
  return prisma.user.findFirst({
    where: { userName },
    include: { role: true, personal: true, global: true },
  });
}

/** Compara a senha informada com o hash `salt:hash` salvo no banco. */
function isPasswordValid(password: string, storedPassword: string) {
  const [salt, key] = storedPassword.split(':');

  if (!salt || !key) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Senha armazenada em formato inválido.',
    });
  }

  const hashedBuffer = scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(key, 'hex');

  return timingSafeEqual(hashedBuffer, keyBuffer);
}

function throwInvalidCredentials(): never {
  throw createError({
    statusCode: 401,
    statusMessage: 'Unauthorized',
    message: 'Credenciais inválidas.',
  });
}

/**
 * Verifica se o usuário pertence ao tipo de acesso informado:
 * - isPersonal true  → precisa existir na tabela Personal;
 * - isPersonal false → precisa existir na tabela Global.
 */
async function userHasProfile(userId: number, isPersonal: boolean) {
  const profile = isPersonal
    ? await prisma.personal.findUnique({ where: { userId } })
    : await prisma.global.findUnique({ where: { userId } });

  return !!profile;
}

/** Valida existência do usuário, senha e tipo de acesso; retorna o usuário autenticado. */
async function authenticateUser(userName: string, password: string, isPersonal: boolean) {
  const user = await findUserByUserName(userName);

  if (!user || !user.password) {
    throwInvalidCredentials();
  }

  if (!isPasswordValid(password, user.password)) {
    throwInvalidCredentials();
  }

  if (!(await userHasProfile(user.id, isPersonal))) {
    throwInvalidCredentials();
  }

  return user;
}

/** Gera o access token (7 dias) e o refresh token (30 dias). */
function generateTokens(user: { id: number; roleId: number | null }) {
  const secret = String(config.jwtSecret);

  const accessToken = jwt.sign({ id: user.id, role: user.roleId }, secret, { expiresIn: '7d' });
  const refreshToken = jwt.sign({ id: user.id }, secret, { expiresIn: '30d' });

  return { accessToken, refreshToken };
}

/** Grava os cookies de sessão (tokens HttpOnly + userName legível pelo front). */
function setSessionCookies(
  event: H3Event,
  tokens: { accessToken: string; refreshToken: string },
  userName: string
) {
  const baseOptions = {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  };

  setCookie(event, 'accessToken', tokens.accessToken, {
    ...baseOptions,
    httpOnly: true,
    maxAge: SEVEN_DAYS_IN_SECONDS,
  });

  setCookie(event, 'refreshToken', tokens.refreshToken, {
    ...baseOptions,
    httpOnly: true,
    maxAge: THIRTY_DAYS_IN_SECONDS,
  });

  setCookie(event, 'userName', userName, {
    ...baseOptions,
    httpOnly: false,
    maxAge: THIRTY_DAYS_IN_SECONDS,
  });
}

/** Remove o hash da senha antes de devolver o usuário ao cliente. */
function omitPassword<T extends { password: string }>(user: T) {
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/** Monta a resposta de sucesso do login, indicando se o usuário é personal. */
function buildLoginResponse(
  user: ReturnType<typeof omitPassword>,
  tokens: { accessToken: string; refreshToken: string },
  isPersonal: boolean
) {
  return {
    statusCode: 200,
    data: {
      ...user,
      ...tokens,
      isPersonal,
    },
    message: 'Login realizado com sucesso.',
  };
}

export default defineEventHandler(async (event) => {
  try {
    const { userName, password, isPersonal } = await getCredentials(event);

    const user = await authenticateUser(userName, password, isPersonal);

    const tokens = generateTokens(user);
    setSessionCookies(event, tokens, user.userName);

    return buildLoginResponse(omitPassword(user), tokens, isPersonal);
  } catch (error: any) {
    if (error.statusCode) throw error;

    console.error('Error logging in:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erro interno ao realizar o login.',
    });
  }
});
