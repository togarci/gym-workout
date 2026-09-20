import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.stubGlobal('useRuntimeConfig', () => ({
  public: { databaseUrl: 'postgres://test' }
}));
vi.stubGlobal('createError', vi.fn((err) => err));
vi.stubGlobal('defineEventHandler', vi.fn((handlerFn) => handlerFn));
vi.stubGlobal('readBody', vi.fn(async (event) => event.body || {}));

const mocks = vi.hoisted(() => ({
  findUnique: vi.fn(),
  update: vi.fn(),
}));

vi.mock('@/generated/prisma/client', () => {
  return {
    PrismaClient: class {
      user = { findUnique: mocks.findUnique, update: mocks.update }
    }
  };
});

vi.mock('@prisma/adapter-pg', () => ({ PrismaPg: class {} }));

const loadHandler = async () => {
  const mod = await import('./update.put');
  return mod.default as any;
};

describe('PUT /api/user/update', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 404 if user not found', async () => {
    const handler = await loadHandler();
    const event = { body: { id: 1 } };
    mocks.findUnique.mockResolvedValueOnce(null);
    
    try {
      await handler(event);
    } catch (e: any) {
      expect(e).toMatchObject({ statusCode: 404 });
    }
  });

  it('should update user successfully', async () => {
    const handler = await loadHandler();
    const event = { body: { id: 1, userName: 'new' } };
    mocks.findUnique.mockResolvedValueOnce({ id: 1 });
    mocks.update.mockResolvedValueOnce({ id: 1, userName: 'new', password: 'pwd' });
    
    const response = await handler(event);
    
    expect(mocks.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { userName: 'new', email: undefined, name: undefined }
    });
    expect(response.password).toBeUndefined();
    expect(response.userName).toBe('new');
  });

  it('should return 409 on unique constraint violation', async () => {
    const handler = await loadHandler();
    const event = { body: { id: 1, userName: 'new' } };
    mocks.findUnique.mockResolvedValueOnce({ id: 1 });
    const err = new Error('conflict');
    (err as any).code = 'P2002';
    mocks.update.mockRejectedValueOnce(err);
    
    try {
      await handler(event);
    } catch (e: any) {
      expect(e).toMatchObject({ statusCode: 409 });
    }
  });

  it('should return 500 on db error', async () => {
    const handler = await loadHandler();
    const event = { body: { id: 1 } };
    mocks.findUnique.mockResolvedValueOnce({ id: 1 });
    mocks.update.mockRejectedValueOnce(new Error('DB Error'));
    
    try {
      await handler(event);
    } catch (e: any) {
      expect(e).toMatchObject({ statusCode: 500 });
    }
  });
});
