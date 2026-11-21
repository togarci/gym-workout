import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { getAuthenticatedPersonalId } from '~~/server/utils/auth';

const config = useRuntimeConfig();

const adapter = new PrismaPg({ connectionString: String(config.public.databaseUrl) } as any);
const prisma = new PrismaClient({ adapter });

export default defineEventHandler(async (event) => {
  try {
    const personalId = await getAuthenticatedPersonalId(
      event,
      'Apenas personais podem acessar os treinos.'
    );

    const workouts = await prisma.workout.findMany({
      where: {
        personalId,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!workouts || workouts.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Workouts not found',
      });
    }

    return {
      statusCode: 200,
      data: workouts,
    };
  } catch (error: any) {
    if (error.statusCode) throw error;

    console.error('Error fetching workouts:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error while fetching workouts.',
    });
  }
});
