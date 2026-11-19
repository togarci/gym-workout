import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { getAuthenticatedPersonalId } from '~~/server/utils/auth';
import { getParamId } from '~~/server/utils/params';
import { validateWorkoutOwnership } from '~~/server/utils/workout';

const config = useRuntimeConfig();

const adapter = new PrismaPg({ connectionString: String(config.public.databaseUrl) } as any);
const prisma = new PrismaClient({ adapter });

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const id = getParamId(event, 'O ID do treino é obrigatório para atualização.');
    const personalId = await getAuthenticatedPersonalId(event, 'Apenas personal podem editar treinos');

    const { name, description, exercises } = body;

    await validateWorkoutOwnership(
      id,
      personalId,
      'Você não tem permissão para atualizar este treino.'
    );

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

    const updatedWorkout = await prisma.workout.update({
      where: { id },
      data: updateData,
      include: {
        exercises: true,
      },
    });

    return {
      statusCode: 200,
      data: updatedWorkout,
      message: 'Workout updated successfully.',
    };
  } catch (error: any) {
    if (error.statusCode) throw error;

    console.error('Error updating workout:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Internal server error while updating the workout.',
    });
  }
});
