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
  const mod = await import('./register.post');
  return mod.default as any;
};

describe('POST /api/exercise/register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if name is missing', async () => {
    const handler = await loadHandler();
    const event = { body: { muscleGroup: 'Legs' } };
    
    const response = await handler(event);
    
    expect(response).toMatchObject({
      statusCode: 400,
      statusMessage: 'Name is a required field.'
    });
  });

  it('should create exercise and return 201', async () => {
    const handler = await loadHandler();
    const event = { body: { name: 'Squat', muscleGroup: 'Legs' } };
    const createdExercise = { id: 1, name: 'Squat', muscleGroup: 'Legs' };
    mocks.create.mockResolvedValueOnce(createdExercise);
    
    const response = await handler(event);
    
    expect(mocks.create).toHaveBeenCalledWith({
      data: { name: 'Squat', muscleGroup: 'Legs' }
    });
    expect(response).toMatchObject({
      statusCode: 201,
      data: createdExercise,
      message: 'Exercise registered successfully.'
    });
  });

  it('should return 500 on database error', async () => {
    const handler = await loadHandler();
    const event = { body: { name: 'Squat' } };
    mocks.create.mockRejectedValueOnce(new Error('DB Error'));
    
    const response = await handler(event);
    
    expect(response).toMatchObject({
      statusCode: 500,
      statusMessage: 'Internal server error while registering the exercise.'
    });
  });
});
