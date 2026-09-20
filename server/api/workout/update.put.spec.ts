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
  const mod = await import('./update.put');
  return mod.default as any;
};

describe('PUT /api/workout/update', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if id is missing', async () => {
    const handler = await loadHandler();
    const event = { body: { name: 'Workout updated' } };
    
    const response = await handler(event);
    
    expect(response).toMatchObject({
      statusCode: 400,
      statusMessage: 'Workout ID is required for update.'
    });
  });

  it('should update workout and return 200', async () => {
    const handler = await loadHandler();
    const event = { body: { id: 1, name: 'Workout updated', exercises: [{ exerciseId: 1 }] } };
    const updatedWorkout = { id: 1, name: 'Workout updated' };
    mocks.update.mockResolvedValueOnce(updatedWorkout);
    
    const response = await handler(event);
    
    expect(mocks.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        name: 'Workout updated',
        exercises: {
          deleteMany: {},
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
      statusCode: 200,
      data: updatedWorkout,
      message: 'Workout updated successfully.'
    });
  });

  it('should update only name when no exercises provided', async () => {
    const handler = await loadHandler();
    const event = { body: { id: 1, name: 'Workout updated' } };
    const updatedWorkout = { id: 1, name: 'Workout updated' };
    mocks.update.mockResolvedValueOnce(updatedWorkout);
    
    const response = await handler(event);
    
    expect(mocks.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        name: 'Workout updated',
      },
      include: {
        exercises: true
      }
    });
  });

  it('should return 500 on database error', async () => {
    const handler = await loadHandler();
    const event = { body: { id: 1, name: 'Workout updated' } };
    mocks.update.mockRejectedValueOnce(new Error('DB Error'));
    
    const response = await handler(event);
    
    expect(response).toMatchObject({
      statusCode: 500,
      statusMessage: 'Internal server error while updating the workout.'
    });
  });
});
