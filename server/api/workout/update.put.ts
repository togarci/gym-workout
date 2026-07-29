import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const config = useRuntimeConfig();

const adapter = new PrismaPg({ connectionString: String(config.public.databaseUrl) } as any);
const prisma = new PrismaClient({ adapter });

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const { id, name, description, exercises } = body;

    if (!id) {
      return createError({
        statusCode: 400,
        statusMessage: 'Workout ID is required for update.',
      });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    if (exercises) {
      updateData.exercises = {
        deleteMany: {}, // Remove all existing exercises for this workout
        create: exercises.map((ex: any, index: number) => ({
          exerciseId: ex.exerciseId,
          sets: ex.sets ?? 3,
          reps: ex.reps ?? '10',
          restTime: ex.restTime,
          order: ex.order ?? index,
          observation: ex.observation,
          tags: ex.tags ?? [],
        })),
      };
    }

    const workout = await prisma.workout.update({
      where: { id },
      data: updateData,
      include: {
        exercises: true,
      },
    });

    return {
      statusCode: 200,
      data: workout,
      message: 'Workout updated successfully.',
    };
  } catch (error) {
    console.error('Error updating workout:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Internal server error while updating the workout.',
    });
  }
});
