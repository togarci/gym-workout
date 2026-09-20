import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.stubGlobal('useRuntimeConfig', () => ({
  public: { databaseUrl: 'postgres://test' }
}));
vi.stubGlobal('createError', vi.fn((err) => err));
vi.stubGlobal('defineEventHandler', vi.fn((handlerFn) => handlerFn));
vi.stubGlobal('getQuery', vi.fn((event) => event.query || {}));

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

const loadHandler = async () => {
  const mod = await import('./get.get');
  return mod.default as any;
};

describe('GET /api/exercise/get', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch all exercises if no name is provided', async () => {
    const handler = await loadHandler();
    const event = { query: {} };
    const mockExercises = [{ id: 1, name: 'Squat' }];
    mocks.findMany.mockResolvedValueOnce(mockExercises);
    
    const response = await handler(event);
    
    expect(mocks.findMany).toHaveBeenCalledWith();
    expect(response).toMatchObject({
      statusCode: 200,
      data: mockExercises
    });
  });

  it('should fetch exercises by name if name is provided', async () => {
    const handler = await loadHandler();
    const event = { query: { name: 'Squat' } };
    const mockExercises = [{ id: 1, name: 'Squat' }];
    mocks.findMany.mockResolvedValueOnce(mockExercises);
    
    const response = await handler(event);
    
    expect(mocks.findMany).toHaveBeenCalledWith({
      where: {
        name: {
          contains: 'Squat',
          mode: 'insensitive'
        }
      }
    });
    expect(response).toMatchObject({
      statusCode: 200,
      data: mockExercises
    });
  });

  it('should return 404 if no exercises found', async () => {
    const handler = await loadHandler();
    const event = { query: {} };
    mocks.findMany.mockResolvedValueOnce([]);
    
    const response = await handler(event);
    
    expect(response).toMatchObject({
      statusCode: 404,
      statusMessage: 'Exercises not found'
    });
  });

  it('should return 500 on database error', async () => {
    const handler = await loadHandler();
    const event = { query: {} };
    mocks.findMany.mockRejectedValueOnce(new Error('DB Error'));
    
    const response = await handler(event);
    
    expect(response).toMatchObject({
      statusCode: 500,
      statusMessage: 'Internal server error while fetching exercises.'
    });
  });
});
