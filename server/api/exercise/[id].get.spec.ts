import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mocks globais para funções auto-importadas do Nuxt
vi.stubGlobal('useRuntimeConfig', () => ({
  public: { databaseUrl: 'postgres://test' }
}));
vi.stubGlobal('createError', vi.fn((err) => err));
vi.stubGlobal('defineEventHandler', vi.fn((handlerFn) => handlerFn));

const mocks = vi.hoisted(() => ({
  findUnique: vi.fn(),
  findMany: vi.fn(),
  create: vi.fn(),
  update: vi.fn()
}));

vi.mock('@/generated/prisma/client', () => {
  return {
    PrismaClient: class {
      exercise = {
        findUnique: mocks.findUnique,
        findMany: mocks.findMany,
        create: mocks.create,
        update: mocks.update
      }
    }
  };
});

vi.mock('@prisma/adapter-pg', () => {
  return {
    PrismaPg: class {}
  };
});

// Dinamicamente carrega o handler após os stubs globais
const loadHandler = async () => {
  const mod = await import('./[id].get');
  return mod.default as any;
};

describe('GET /api/exercise/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if id is invalid', async () => {
    const handler = await loadHandler();
    const event = {
      context: { params: { id: 'invalid' } }
    };
    
    const response = await handler(event);
    
    expect(response).toMatchObject({
      statusCode: 400,
      statusMessage: 'Invalid exercise ID'
    });
  });

  it('should return 404 if exercise is not found', async () => {
    const handler = await loadHandler();
    const event = {
      context: { params: { id: '1' } }
    };
    mocks.findUnique.mockResolvedValueOnce(null);
    
    const response = await handler(event);
    
    expect(response).toMatchObject({
      statusCode: 404,
      statusMessage: 'Exercise not found'
    });
    expect(mocks.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should return 200 and the exercise if found', async () => {
    const handler = await loadHandler();
    const event = {
      context: { params: { id: '1' } }
    };
    const mockExercise = { id: 1, name: 'Squat', muscleGroup: 'Legs' };
    mocks.findUnique.mockResolvedValueOnce(mockExercise);
    
    const response = await handler(event);
    
    expect(response).toMatchObject({
      statusCode: 200,
      data: mockExercise
    });
  });

  it('should return 500 on database error', async () => {
    const handler = await loadHandler();
    const event = {
      context: { params: { id: '1' } }
    };
    mocks.findUnique.mockRejectedValueOnce(new Error('DB Error'));
    
    const response = await handler(event);
    
    expect(response).toMatchObject({
      statusCode: 500,
      statusMessage: 'Internal server error while fetching the exercise.'
    });
  });
});
