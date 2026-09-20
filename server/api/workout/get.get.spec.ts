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
  const mod = await import('./get.get');
  return mod.default as any;
};

describe('GET /api/workout/get', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch all workouts if no userName is provided', async () => {
    const handler = await loadHandler();
    const event = { query: {} };
    const mockWorkouts = [{ id: 1, name: 'Workout' }];
    mocks.findMany.mockResolvedValueOnce(mockWorkouts);
    
    const response = await handler(event);
    
    expect(mocks.findMany).toHaveBeenCalledWith({
      where: undefined,
      select: {
        id: true,
        name: true,
      }
    });
    expect(response).toMatchObject({
      statusCode: 200,
      data: mockWorkouts
    });
  });

  it('should fetch workouts by userName if userName is provided', async () => {
    const handler = await loadHandler();
    const event = { query: { userName: 'johndoe' } };
    const mockWorkouts = [{ id: 1, name: 'Workout' }];
    mocks.findMany.mockResolvedValueOnce(mockWorkouts);
    
    const response = await handler(event);
    
    expect(mocks.findMany).toHaveBeenCalledWith({
      where: {
        user: {
          userName: 'johndoe'
        }
      },
      select: {
        id: true,
        name: true,
      }
    });
    expect(response).toMatchObject({
      statusCode: 200,
      data: mockWorkouts
    });
  });

  it('should return 404 if no workouts found', async () => {
    const handler = await loadHandler();
    const event = { query: {} };
    mocks.findMany.mockResolvedValueOnce([]);
    
    const response = await handler(event);
    
    expect(response).toMatchObject({
      statusCode: 404,
      statusMessage: 'Workouts not found'
    });
  });

  it('should return 500 on database error', async () => {
    const handler = await loadHandler();
    const event = { query: {} };
    mocks.findMany.mockRejectedValueOnce(new Error('DB Error'));
    
    const response = await handler(event);
    
    expect(response).toMatchObject({
      statusCode: 500,
      statusMessage: 'Internal server error while fetching workouts.'
    });
  });
});
