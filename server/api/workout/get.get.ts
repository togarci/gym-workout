import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const config = useRuntimeConfig();

const adapter = new PrismaPg({ connectionString: String(config.public.databaseUrl) } as any);
const prisma = new PrismaClient({ adapter });

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const userName = query.userName as string | undefined;

    const workouts = await prisma.workout.findMany({
      where: userName ? {
        user: {
          userName: userName
        }
      } : undefined,
      select: {
        id: true,
        name: true,
      },
    });

    return {
      statusCode: 200,
      data: workouts,
    };
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Internal server error while fetching workouts.',
    });
  }
});
