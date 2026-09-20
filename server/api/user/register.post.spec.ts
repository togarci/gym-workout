import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.stubGlobal('useRuntimeConfig', () => ({
  public: { databaseUrl: 'postgres://test' }
}));
vi.stubGlobal('createError', vi.fn((err) => err));
vi.stubGlobal('defineEventHandler', vi.fn((handlerFn) => handlerFn));
vi.stubGlobal('readBody', vi.fn(async (event) => event.body || {}));

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
}));

vi.mock('@/generated/prisma/client', () => {
  return {
    PrismaClient: class {
      user = { create: mocks.create }
    }
  };
});

vi.mock('@prisma/adapter-pg', () => ({ PrismaPg: class {} }));

const loadHandler = async () => {
  const mod = await import('./register.post');
  return mod.default as any;
};

describe('POST /api/user/register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if userName is missing', async () => {
    const handler = await loadHandler();
    const event = { body: { email: 'a@a.com' } };
    
    try {
      await handler(event);
    } catch (e: any) {
      expect(e).toMatchObject({ statusCode: 400 });
    }
  });

  it('should create user', async () => {
    const handler = await loadHandler();
    const event = { body: { userName: 'user', email: 'a@a.com', password: '123' } };
    mocks.create.mockResolvedValueOnce({ id: 1, userName: 'user', email: 'a@a.com', password: 'hash' });
    
    const response = await handler(event);
    
    expect(mocks.create).toHaveBeenCalled();
    expect(response).toMatchObject({ id: 1, userName: 'user' });
    expect(response.password).toBeUndefined();
  });

  it('should return 409 on unique constraint violation', async () => {
    const handler = await loadHandler();
    const event = { body: { userName: 'user', email: 'a@a.com' } };
    const err = new Error('conflict');
    (err as any).code = 'P2002';
    mocks.create.mockRejectedValueOnce(err);
    
    try {
      await handler(event);
    } catch (e: any) {
      expect(e).toMatchObject({ statusCode: 409 });
    }
  });
  
  it('should return 500 on db error', async () => {
    const handler = await loadHandler();
    const event = { body: { userName: 'user' } };
    mocks.create.mockRejectedValueOnce(new Error('DB Error'));
    
    try {
      await handler(event);
    } catch (e: any) {
      expect(e).toMatchObject({ statusCode: 500 });
    }
  });
});
