import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const config = useRuntimeConfig();

const adapter = new PrismaPg({ connectionString: String(config.public.databaseUrl) } as any);
const prisma = new PrismaClient({ adapter });

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(event.context.params?.id || '', 10);

    if (isNaN(id)) {
      return createError({
        statusCode: 400,
        statusMessage: 'Invalid workout ID',
      });
    }

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
  } catch (error) {
    console.error('Error fetching workout by ID:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Internal server error while fetching the workout.',
    });
  }
});
