import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const config = useRuntimeConfig();

const adapter = new PrismaPg({ connectionString: String(config.public.databaseUrl) } as any);
const prisma = new PrismaClient({ adapter });

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const { name, description, userId, exercises } = body;

    if (!name || !userId) {
      return createError({
        statusCode: 400,
        statusMessage: 'Name and userId are required fields.',
      });
    }

    const workout = await prisma.workout.create({
      data: {
        name,
        description,
        userId,
        exercises: {
          create: exercises?.map((ex: any, index: number) => ({
            exerciseId: ex.exerciseId,
            sets: ex.sets ?? 3,
            reps: ex.reps ?? '10',
            restTime: ex.restTime,
            order: ex.order ?? index,
            observation: ex.observation,
            tags: ex.tags ?? [],
          })) || [],
        },
      },
      include: {
        exercises: true,
      },
    });

    return {
      statusCode: 201,
      data: workout,
      message: 'Workout registered successfully.',
    };
  } catch (error) {
    console.error('Error registering workout:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Internal server error while registering the workout.',
    });
  }
});
