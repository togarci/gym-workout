import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import type { H3Event } from 'h3';

const config = useRuntimeConfig();
const adapter = new PrismaPg({ connectionString: String(config.public.databaseUrl) });
const prisma = new PrismaClient({ adapter });

export async function getAuthenticatedPersonal(
  event: H3Event,
  forbiddenMessage = 'Apenas personais têm permissão para realizar esta ação.'
) {
  const userContext = event.context.user;

  if (!userContext) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Usuário não autenticado.',
    });
  }

  const personal = await prisma.personal.findUnique({
    where: { userId: userContext.id },
  });

  if (!personal) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: forbiddenMessage,
    });
  }

  return personal;
}

export async function getAuthenticatedPersonalId(
  event: H3Event,
  forbiddenMessage?: string
): Promise<number> {
  const personal = await getAuthenticatedPersonal(event, forbiddenMessage);
  return personal.id;
}
