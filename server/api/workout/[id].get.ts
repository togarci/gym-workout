import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { getParamId } from '~~/server/utils/params';

const config = useRuntimeConfig();

const adapter = new PrismaPg({ connectionString: String(config.public.databaseUrl) } as any);
const prisma = new PrismaClient({ adapter });

export default defineEventHandler(async (event) => {
  try {
    const id = getParamId(event, 'ID do treino inválido.');

    const workout = await prisma.workout.findUnique({
      where: {
        id: id,
      },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    if (!workout) {
      return createError({
        statusCode: 404,
        statusMessage: 'Workout not found',
      });
    }

    return {
      statusCode: 200,
      data: workout,
    };
  } catch (error: any) {
    if (error.statusCode) throw error;

    console.error('Error fetching workout by ID:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Internal server error while fetching the workout.',
    });
  }
});
