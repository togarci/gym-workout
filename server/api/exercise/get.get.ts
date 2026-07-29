import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const config = useRuntimeConfig();

const adapter = new PrismaPg({ connectionString: String(config.public.databaseUrl) } as any);
const prisma = new PrismaClient({ adapter });

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const name = query.name as string | undefined;

    let exercises;

    if (name) {
      exercises = await prisma.exercise.findMany({
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
      });
    } else {
      exercises = await prisma.exercise.findMany();
    }

    return {
      statusCode: 200,
      data: exercises,
    };
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Internal server error while fetching exercises.',
    });
  }
});
