import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import jwt from 'jsonwebtoken';

const config = useRuntimeConfig();

const adapter = new PrismaPg({ connectionString: String(config.public.databaseUrl) });
const prisma = new PrismaClient({ adapter });

export default defineEventHandler(async (event) => {
  try {
    const refreshTokenInput = getHeader(event, 'x-refresh-token');

    if (!refreshTokenInput) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Refresh token não fornecido.',
      });
    }

    let decoded: any;
    try {
      decoded = jwt.verify(refreshTokenInput, String(config.jwtSecret));
    } catch (err) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Refresh token inválido ou expirado.',
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

    const { password: _, ...userWithoutPassword } = user;

    const accessToken = jwt.sign(
      { id: user.id, role: user.roleId },
      String(config.jwtSecret),
      { expiresIn: '1d' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      String(config.jwtSecret),
      { expiresIn: '5d' }
    );

    return {
      statusCode: 200,
      data: {
        ...userWithoutPassword,
        accessToken,
        refreshToken,
      },
      message: 'Token atualizado com sucesso.',
    };
  } catch (error: any) {
    if (error.statusCode) throw error;

    console.error('Error refreshing token:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Erro interno ao atualizar o token.',
    });
  }
});
