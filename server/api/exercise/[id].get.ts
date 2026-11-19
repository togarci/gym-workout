import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { getParamId } from '~~/server/utils/params';

const config = useRuntimeConfig();

const adapter = new PrismaPg({ connectionString: String(config.public.databaseUrl) } as any);
const prisma = new PrismaClient({ adapter });

export default defineEventHandler(async (event) => {
  try {
    const id = getParamId(event, 'ID do exercício inválido.');

    const exercise = await prisma.exercise.findUnique({
      where: {
        id: id,
      },
    });

    if (!exercise) {
      return createError({
        statusCode: 404,
        statusMessage: 'Exercise not found',
      });
    }

    return {
      statusCode: 200,
      data: exercise,
    };
  } catch (error: any) {
    if (error.statusCode) throw error;

    console.error('Error fetching exercise by ID:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Internal server error while fetching the exercise.',
    });
  }
});
