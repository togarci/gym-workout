import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.stubGlobal('useRuntimeConfig', () => ({
  public: { databaseUrl: 'postgres://test' }
}));
vi.stubGlobal('createError', vi.fn((err) => err));
vi.stubGlobal('defineEventHandler', vi.fn((handlerFn) => handlerFn));
vi.stubGlobal('readBody', vi.fn(async (event) => event.body || {}));

const mocks = vi.hoisted(() => ({
  findUnique: vi.fn(),
  delete: vi.fn(),
}));

vi.mock('@/generated/prisma/client', () => {
  return {
    PrismaClient: class {
      user = {
        findUnique: mocks.findUnique,
        delete: mocks.delete,
      }
    }
  };
});

vi.mock('@prisma/adapter-pg', () => {
  return { PrismaPg: class {} };
});

const loadHandler = async () => {
  const mod = await import('./delete.delete');
  return mod.default as any;
};

describe('DELETE /api/user/delete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 404 if user is not found', async () => {
    const handler = await loadHandler();
    const event = { body: { id: 1 } };
    mocks.findUnique.mockResolvedValueOnce(null);
    
    try {
      await handler(event);
    } catch (e: any) {
      expect(e).toMatchObject({ statusCode: 404 });
    }
  });

  it('should delete user if found', async () => {
    const handler = await loadHandler();
    const event = { body: { id: 1 } };
    mocks.findUnique.mockResolvedValueOnce({ id: 1 });
    mocks.delete.mockResolvedValueOnce({});
    
    const response = await handler(event);
    
    expect(mocks.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(response).toMatchObject({ status: 'user deleted' });
  });

  it('should return 500 on delete error', async () => {
    const handler = await loadHandler();
    const event = { body: { id: 1 } };
    mocks.findUnique.mockResolvedValueOnce({ id: 1 });
    mocks.delete.mockRejectedValueOnce(new Error('DB Error'));
    
    try {
      await handler(event);
    } catch (e: any) {
      expect(e).toMatchObject({ statusCode: 500 });
    }
  });
});
