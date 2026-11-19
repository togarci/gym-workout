import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { getAuthenticatedPersonalId } from '~~/server/utils/auth';
import { validateWorkoutOwnership } from '~~/server/utils/workout';

const config = useRuntimeConfig();

const adapter = new PrismaPg({ connectionString: String(config.public.databaseUrl) });
const prisma = new PrismaClient({ adapter });

export default defineEventHandler(async (event) => {
  try {
    const personalId = await getAuthenticatedPersonalId(
      event,
      'Apenas personais podem vincular treinos a alunos.'
    );

    const body = await readBody(event);
    const workoutId = Number(body?.workoutId);
    const globalId = Number(body?.globalId);

    if (!workoutId || Number.isNaN(workoutId) || !globalId || Number.isNaN(globalId)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Os campos `workoutId` e `globalId` são obrigatórios.',
      });
    }

    const [_, global] = await Promise.all([
      validateWorkoutOwnership(
        workoutId,
        personalId,
        'Você não tem permissão para vincular este treino.'
      ),
      prisma.global.findUnique({ where: { id: globalId } }),
    ]);

    if (!global) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Aluno (global) não encontrado.',
      });
    }

    if (global.personalId !== personalId) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden',
        message: 'Você não tem permissão para vincular treinos a este aluno.',
      });
    }

    const globalWorkout = await prisma.globalWorkout.create({
      data: {
        workoutId,
        globalId,
      },
      include: {
        workout: true,
        global: true,
      },
    });

    return {
      statusCode: 201,
      data: globalWorkout,
      message: 'Treino vinculado ao aluno com sucesso.',
    };
  } catch (error: any) {
    if (error.statusCode) throw error;

    if (error.code === 'P2002') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Conflict',
        message: 'Este treino já está vinculado a este aluno.',
      });
    }

    console.error('Error assigning workout to global user:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erro interno ao vincular o treino ao aluno.',
    });
  }
});
