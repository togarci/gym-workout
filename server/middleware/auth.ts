import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { protectedRoutes } from '../config/auth.config';
import jwt from 'jsonwebtoken';

const config = useRuntimeConfig();

const adapter = new PrismaPg({ connectionString: String(config.public.databaseUrl) });
const prisma = new PrismaClient({ adapter });

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);
  const pathname = url.pathname;

  const matchedRoute = protectedRoutes.find((route) => {
    if (route.exact) {
      return pathname === route.path;
    }
    return pathname === route.path || pathname.startsWith(route.path + '/');
  });

  if (matchedRoute) {
    const authHeader = getHeader(event, 'authorization');

    if (!authHeader) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Token de autenticação não fornecido.',
      });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

    let decoded: any;
    try {
      decoded = jwt.verify(token, String(config.jwtSecret));
    } catch (err) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Token de autenticação inválido ou expirado.',
      });
    }

    const userId = decoded.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Usuário não encontrado ou sessão inválida.',
      });
    }

    if (matchedRoute.roles && matchedRoute.roles.length > 0) {
      const userRoleName = user.role?.name;

      if (!userRoleName || !matchedRoute.roles.includes(userRoleName)) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Forbidden',
          message: 'Você não possui permissão para acessar esta rota.',
        });
      }
    }

    event.context.user = user;
  }
});
