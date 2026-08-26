import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { scryptSync, timingSafeEqual } from 'crypto';
import jwt from 'jsonwebtoken';

const config = useRuntimeConfig();

const adapter = new PrismaPg({ connectionString: String(config.public.databaseUrl) });
const prisma = new PrismaClient({ adapter });

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { userName, password } = body;

    if (!userName || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Email/userName e password são obrigatórios.',
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          userName ? { userName } : undefined,
        ].filter(Boolean) as any,
      },
    });

    if (!user || !user.password) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Credenciais inválidas.',
      });
    }

    const [salt, key] = user.password.split(':');
    if (!salt || !key) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        message: 'Senha armazenada em formato inválido.',
      });
    }

    const hashedBuffer = scryptSync(password, salt, 64);
    const keyBuffer = Buffer.from(key, 'hex');

    const isMatch = timingSafeEqual(hashedBuffer, keyBuffer);

    if (!isMatch) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Credenciais inválidas.',
      });
    }

    const { password: _, ...userWithoutPassword } = user;

    const accessToken = jwt.sign(
      { id: user.id, role: user.roleId },
      String(config.jwtSecret),
      { expiresIn: '7d' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      String(config.jwtSecret),
      { expiresIn: '30d' }
    );

    // Grava cookies HttpOnly no navegador
    setCookie(event, 'accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    });

    setCookie(event, 'refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 dias
      path: '/',
    });

    setCookie(event, 'userName', user.userName, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    return {
      statusCode: 200,
      data: {
        ...userWithoutPassword,
        accessToken,
        refreshToken,
      },
      message: 'Login realizado com sucesso.',
    };
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
