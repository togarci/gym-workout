import { describe, it, expect, vi, beforeEach } from 'vitest';

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
      workout = {
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
  const mod = await import('./[id].get');
  return mod.default as any;
};

describe('GET /api/workout/[id]', () => {
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
      statusMessage: 'Invalid workout ID'
    });
  });

  it('should return 404 if workout is not found', async () => {
    const handler = await loadHandler();
    const event = {
      context: { params: { id: '1' } }
    };
    mocks.findUnique.mockResolvedValueOnce(null);
    
    const response = await handler(event);
    
    expect(response).toMatchObject({
      statusCode: 404,
      statusMessage: 'Workout not found'
    });
    expect(mocks.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: {
        exercises: {
          include: { exercise: true },
          orderBy: { order: 'asc' },
        },
      }
    });
  });

  it('should return 200 and the workout if found', async () => {
    const handler = await loadHandler();
    const event = {
      context: { params: { id: '1' } }
    };
    const mockWorkout = { id: 1, name: 'A' };
    mocks.findUnique.mockResolvedValueOnce(mockWorkout);
    
    const response = await handler(event);
    
    expect(response).toMatchObject({
      statusCode: 200,
      data: mockWorkout
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
      statusMessage: 'Internal server error while fetching the workout.'
    });
  });
});
