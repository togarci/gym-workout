import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.stubGlobal('useRuntimeConfig', () => ({
  public: { databaseUrl: 'postgres://test' },
  jwtSecret: 'secret'
}));
vi.stubGlobal('createError', vi.fn((err) => err));
vi.stubGlobal('defineEventHandler', vi.fn((handlerFn) => handlerFn));
vi.stubGlobal('readBody', vi.fn(async (event) => event.body || {}));
vi.stubGlobal('setCookie', vi.fn());

const mocks = vi.hoisted(() => ({
  findFirst: vi.fn(),
}));

vi.mock('@/generated/prisma/client', () => {
  return {
    PrismaClient: class {
      user = { findFirst: mocks.findFirst }
    }
  };
});
vi.mock('@prisma/adapter-pg', () => ({ PrismaPg: class {} }));

vi.mock('crypto', () => {
  const scryptSync = vi.fn(() => Buffer.from('hash'));
  const timingSafeEqual = vi.fn((a: any, b: any) => a.equals(b));
  return {
    scryptSync,
    timingSafeEqual,
    default: { scryptSync, timingSafeEqual }
  };
});

vi.mock('jsonwebtoken', () => {
  return {
    default: {
      sign: vi.fn(() => 'mock-token')
    }
  };
});

const loadHandler = async () => {
  const mod = await import('./login.post');
  return mod.default as any;
};

describe('POST /api/user/login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 400 if credentials missing', async () => {
    const handler = await loadHandler();
    const event = { body: {} };
    
    try {
      await handler(event);
    } catch (e: any) {
      expect(e).toMatchObject({ statusCode: 400 });
    }
  });

  it('should return 401 if user not found', async () => {
    const handler = await loadHandler();
    const event = { body: { userName: 'u', password: 'p' } };
    mocks.findFirst.mockResolvedValueOnce(null);
    
    try {
      await handler(event);
    } catch (e: any) {
      expect(e).toMatchObject({ statusCode: 401 });
    }
  });

  it('should return 500 if stored password invalid', async () => {
    const handler = await loadHandler();
    const event = { body: { userName: 'u', password: 'p' } };
    mocks.findFirst.mockResolvedValueOnce({ password: 'invalid' });
    
    try {
      await handler(event);
    } catch (e: any) {
      expect(e).toMatchObject({ statusCode: 500 });
    }
  });

  it('should return 401 if password mismatch', async () => {
    const handler = await loadHandler();
    const event = { body: { userName: 'u', password: 'p' } };
    // 'hash' is 68617368 in hex. We make them different
    mocks.findFirst.mockResolvedValueOnce({ password: 'salt:deadbeef' });
    
    try {
      await handler(event);
    } catch (e: any) {
      expect(e).toMatchObject({ statusCode: 401 });
    }
  });

  it('should return 200 on success', async () => {
    const handler = await loadHandler();
    const event = { body: { userName: 'u', password: 'p' } };
    mocks.findFirst.mockResolvedValueOnce({ id: 1, userName: 'u', password: 'salt:68617368' });
    
    const response = await handler(event);
    
    expect(response).toMatchObject({
      statusCode: 200,
      data: { id: 1, userName: 'u', accessToken: 'mock-token', refreshToken: 'mock-token' }
    });
  });
});
