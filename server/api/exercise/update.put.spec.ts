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
  const mod = await import('./update.put');
  return mod.default as any;
};

describe('PUT /api/exercise/update', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if id is missing', async () => {
    const handler = await loadHandler();
    const event = { body: { name: 'Squat updated' } };
    
    const response = await handler(event);
    
    expect(response).toMatchObject({
      statusCode: 400,
      statusMessage: 'Exercise ID is required for update.'
    });
  });

  it('should update exercise and return 200', async () => {
    const handler = await loadHandler();
    const event = { body: { id: 1, name: 'Squat updated', muscleGroup: 'Legs' } };
    const updatedExercise = { id: 1, name: 'Squat updated', muscleGroup: 'Legs' };
    mocks.update.mockResolvedValueOnce(updatedExercise);
    
    const response = await handler(event);
    
    expect(mocks.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { name: 'Squat updated', muscleGroup: 'Legs' }
    });
    expect(response).toMatchObject({
      statusCode: 200,
      data: updatedExercise,
      message: 'Exercise updated successfully.'
    });
  });

  it('should return 500 on database error', async () => {
    const handler = await loadHandler();
    const event = { body: { id: 1, name: 'Squat updated' } };
    mocks.update.mockRejectedValueOnce(new Error('DB Error'));
    
    const response = await handler(event);
    
    expect(response).toMatchObject({
      statusCode: 500,
      statusMessage: 'Internal server error while updating the exercise.'
    });
  });
});
