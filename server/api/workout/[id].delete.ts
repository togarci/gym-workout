import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { getAuthenticatedPersonalId } from '~~/server/utils/auth';
import { getParamId } from '~~/server/utils/params';
import { validateWorkoutOwnership } from '~~/server/utils/workout';

const config = useRuntimeConfig();

const adapter = new PrismaPg({ connectionString: String(config.public.databaseUrl) });
const prisma = new PrismaClient({ adapter });

export default defineEventHandler(async (event) => {
  try {
    const personalId = await getAuthenticatedPersonalId(
      event,
      'Apenas personais podem deletar treinos.'
    );

    const id = getParamId(event, 'O ID do treino é obrigatório.');

    await validateWorkoutOwnership(
      id,
      personalId,
      'Você não tem permissão para deletar este treino.'
    );

    await prisma.workout.delete({
      where: { id },
    });

    return {
      statusCode: 200,
      message: 'Treino deletado com sucesso.',
    };
  } catch (error: any) {
    if (error.statusCode) throw error;

    console.error('Error deleting workout:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erro interno ao deletar o treino.',
    });
  }
});
