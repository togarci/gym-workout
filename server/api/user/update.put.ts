import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const config = useRuntimeConfig();
const adapter = new PrismaPg({ connectionString: String(config.public.databaseUrl) });
const prisma = new PrismaClient({ adapter });

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // TODO: O ID do usuário deve vir de uma sessão de autenticação, não do corpo da requisição.
  // Exemplo: const { id } = await getUserFromSession(event);
  // Isso previne que um usuário modifique os dados de outro.

  const { id, userName, email, name } = body;
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not found',
      message: 'Usuario nao encontrado.',
    });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        userName,
        email,
        name,
      },
    });

    const { password: _, ...userWithoutPassword } = updatedUser;

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
