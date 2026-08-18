import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const config = useRuntimeConfig();

const adapter = new PrismaPg({ connectionString: String(config.public.databaseUrl) } as any);
const prisma = new PrismaClient({ adapter });

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const { name, muscleGroup } = body;

    if (!name) {
      return createError({
        statusCode: 400,
        statusMessage: 'Name is a required field.',
      });
    }

    const exercise = await prisma.exercise.create({
      data: {
        name,
        muscleGroup,
      },
    });

    return {
      statusCode: 201,
      data: exercise,
      message: 'Exercise registered successfully.',
    };
  } catch (error) {
    console.error('Error registering exercise:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Internal server error while registering the exercise.',
    });
  }
});
