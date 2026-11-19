import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const config = useRuntimeConfig();

const adapter = new PrismaPg({ connectionString: String(config.public.databaseUrl) });
const prisma = new PrismaClient({ adapter });

export default defineEventHandler(async (event) => {
  const userContext = event.context.user;

  if (!userContext) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Usuário não autenticado.',
    });
  }

  try {
    const personal = await prisma.personal.findUnique({
      where: { userId: userContext.id },
      include: {
        user: {
          select: {
            id: true,
            userName: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            role: true,
          },
        },
      },
    });

    if (!personal) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Personal não encontrado.',
      });
    }

    return {
      statusCode: 200,
      data: personal,
    };
  } catch (error: any) {
    if (error.statusCode) throw error;

    console.error('Error fetching personal:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erro interno ao buscar dados do personal.',
    });
  }
});
