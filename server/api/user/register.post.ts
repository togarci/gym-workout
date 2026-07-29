import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { scryptSync, randomBytes } from 'crypto';

const config = useRuntimeConfig();

const adapter = new PrismaPg({ connectionString: String(config.public.databaseUrl) });
const prisma = new PrismaClient({ adapter });

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { userName, email, password, name } = body;

  if (!userName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: '`userName` é obrigatório.',
    });
  }

  try {
    let hashedPassword = undefined;
    if (password) {
      const salt = randomBytes(16).toString('hex');
      const hash = scryptSync(password, salt, 64).toString('hex');
      hashedPassword = `${salt}:${hash}`;
    }

    const newUser = await prisma.user.create({
      data: {
        userName,
        email,
        password: hashedPassword,
        name,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;

    return userWithoutPassword;
  } catch (error: any) {
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

