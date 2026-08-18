import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const config = useRuntimeConfig();

const adapter = new PrismaPg({ connectionString: String(config.public.databaseUrl) } as any);
const prisma = new PrismaClient({ adapter });

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const { id, name, muscleGroup } = body;

    if (!id) {
      return createError({
        statusCode: 400,
        statusMessage: 'Exercise ID is required for update.',
      });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (muscleGroup !== undefined) updateData.muscleGroup = muscleGroup;

    const exercise = await prisma.exercise.update({
      where: { id },
      data: updateData,
    });

    return {
      statusCode: 200,
      data: exercise,
      message: 'Exercise updated successfully.',
    };
  } catch (error) {
    console.error('Error updating exercise:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Internal server error while updating the exercise.',
    });
  }
});
