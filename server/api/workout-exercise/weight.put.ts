import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const config = useRuntimeConfig();

const adapter = new PrismaPg({ connectionString: String(config.public.databaseUrl) } as any);
const prisma = new PrismaClient({ adapter });

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { id, weight } = body;

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID is required',
    });
  }

  const updatedExercise = await prisma.workoutExercise.update({
    where: {
      id: Number(id),
    },
    data: {
      weight: weight ? String(weight) : null,
    },
  });

  return updatedExercise;
});
