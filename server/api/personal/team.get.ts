import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { getAuthenticatedPersonalId } from '~~/server/utils/auth';

const config = useRuntimeConfig();

const adapter = new PrismaPg({ connectionString: String(config.public.databaseUrl) });
const prisma = new PrismaClient({ adapter });

export default defineEventHandler(async (event) => {
  try {
    const personalId = await getAuthenticatedPersonalId(event, 'Apenas personais podem acessar a lista de alunos.');

    const globals = await prisma.global.findMany({
      where: {
        personalId,
      },
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
        workouts: {
          select: {
            workoutId: true,
          },
        },
      },
    });

    return {
      statusCode: 200,
      data: globals,
    };
  } catch (error: any) {
    if (error.statusCode) throw error;

    console.error('Error fetching personal team:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erro interno ao buscar os alunos do personal.',
    });
  }
});
