import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.stubGlobal('useRuntimeConfig', () => ({
  public: { databaseUrl: 'postgres://test' }
}));
vi.stubGlobal('createError', vi.fn((err) => err));
vi.stubGlobal('defineEventHandler', vi.fn((handlerFn) => handlerFn));
vi.stubGlobal('readBody', vi.fn(async (event) => event.body || {}));

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
  const mod = await import('./register.post');
  return mod.default as any;
};

describe('POST /api/workout/register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if name is missing', async () => {
    const handler = await loadHandler();
    const event = { body: { userId: 1 } };
    
    const response = await handler(event);
    
    expect(response).toMatchObject({
      statusCode: 400,
      statusMessage: 'Name and userId are required fields.'
    });
  });

  it('should return 400 if userId is missing', async () => {
    const handler = await loadHandler();
    const event = { body: { name: 'Workout A' } };
    
    const response = await handler(event);
    
    expect(response).toMatchObject({
      statusCode: 400,
      statusMessage: 'Name and userId are required fields.'
    });
  });

  it('should create workout and return 201', async () => {
    const handler = await loadHandler();
    const event = { body: { name: 'Workout A', userId: 1, exercises: [{ exerciseId: 1 }] } };
    const createdWorkout = { id: 1, name: 'Workout A', userId: 1 };
    mocks.create.mockResolvedValueOnce(createdWorkout);
    
    const response = await handler(event);
    
    expect(mocks.create).toHaveBeenCalledWith({
      data: {
        name: 'Workout A',
        userId: 1,
        description: undefined,
        exercises: {
          create: [{
            exerciseId: 1,
            sets: 3,
            reps: '10',
            restTime: undefined,
            order: 0,
            observation: undefined,
            tags: [],
          }]
        }
      },
      include: {
        exercises: true
      }
    });
    expect(response).toMatchObject({
      statusCode: 201,
      data: createdWorkout,
      message: 'Workout registered successfully.'
    });
  });

  it('should return 500 on database error', async () => {
    const handler = await loadHandler();
    const event = { body: { name: 'Workout A', userId: 1 } };
    mocks.create.mockRejectedValueOnce(new Error('DB Error'));
    
    const response = await handler(event);
    
    expect(response).toMatchObject({
      statusCode: 500,
      statusMessage: 'Internal server error while registering the workout.'
    });
  });
});
