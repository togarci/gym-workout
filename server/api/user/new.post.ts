import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { scryptSync, randomBytes } from 'crypto';
import { getAuthenticatedPersonalId } from '~~/server/utils/auth';

const config = useRuntimeConfig();

const adapter = new PrismaPg({ connectionString: String(config.public.databaseUrl) });
const prisma = new PrismaClient({ adapter });

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userName, email, password, name } = body;

  if (!userName || !email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: '`userName` , `email` e `password` são obrigatórios.',
    });
  }

  try {
    const personalId = await getAuthenticatedPersonalId(
      event,
      'Apenas personais podem cadastrar usuários.'
    );

    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    const hashedPassword = `${salt}:${hash}`;

    const newUser = await prisma.user.create({
      data: {
        userName,
        email,
        password: hashedPassword,
        role: { connect: { name: 'global' } },
        global: {
          create: { name, personalId },
        },
      },
      include: { global: true },
    });

    const { password: _, ...userWithoutPassword } = newUser;

    return userWithoutPassword;
  } catch (error: any) {
    if (error.statusCode) throw error;

    if (error.code === 'P2002') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Conflict',
        message: 'Um usuário com este `userName` ou `email` já existe.',
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: error.message,
    });
  }
});
