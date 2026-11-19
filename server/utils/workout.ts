import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const config = useRuntimeConfig();
const adapter = new PrismaPg({ connectionString: String(config.public.databaseUrl) });
const prisma = new PrismaClient({ adapter });

export async function validateWorkoutOwnership(
  workoutId: number,
  personalId: number,
  forbiddenMessage = 'Você não tem permissão para modificar este treino.'
) {
  const workout = await prisma.workout.findUnique({
    where: { id: workoutId },
  });

  if (!workout) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'Treino não encontrado.',
    });
  }

  if (workout.personalId !== personalId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: forbiddenMessage,
    });
  }

  return workout;
}
