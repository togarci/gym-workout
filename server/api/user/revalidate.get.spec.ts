import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.stubGlobal('useRuntimeConfig', () => ({
  public: { databaseUrl: 'postgres://test' },
  jwtSecret: 'secret'
}));
vi.stubGlobal('createError', vi.fn((err) => err));
vi.stubGlobal('defineEventHandler', vi.fn((handlerFn) => handlerFn));
vi.stubGlobal('setCookie', vi.fn());

const getCookieMock = vi.fn();
vi.stubGlobal('getCookie', getCookieMock);

const mocks = vi.hoisted(() => ({
  findUnique: vi.fn(),
}));

vi.mock('@/generated/prisma/client', () => {
  return {
    PrismaClient: class {
      user = { findUnique: mocks.findUnique }
    }
  };
});
vi.mock('@prisma/adapter-pg', () => ({ PrismaPg: class {} }));

const mockVerify = vi.fn();
vi.mock('jsonwebtoken', () => {
  return {
    default: {
      sign: vi.fn(() => 'mock-token'),
      verify: mockVerify,
    }
  };
});

const loadHandler = async () => {
  const mod = await import('./revalidate.get');
  return mod.default as any;
};

describe('GET /api/user/revalidate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if token missing', async () => {
    const handler = await loadHandler();
    const event = {};
    getCookieMock.mockReturnValueOnce(null);
    
    try {
      await handler(event);
    } catch (e: any) {
      expect(e).toMatchObject({ statusCode: 401 });
    }
  });

  it('should return 401 if token invalid', async () => {
    const handler = await loadHandler();
    const event = {};
    getCookieMock.mockReturnValueOnce('token');
    mockVerify.mockImplementationOnce(() => { throw new Error(); });
    
    try {
      await handler(event);
    } catch (e: any) {
      expect(e).toMatchObject({ statusCode: 401 });
    }
  });

  it('should return 401 if user not found', async () => {
    const handler = await loadHandler();
    const event = {};
    getCookieMock.mockReturnValueOnce('token');
    mockVerify.mockReturnValueOnce({ id: 1 });
    mocks.findUnique.mockResolvedValueOnce(null);
    
    try {
      await handler(event);
    } catch (e: any) {
      expect(e).toMatchObject({ statusCode: 401 });
    }
  });

  it('should return 200 on success', async () => {
    const handler = await loadHandler();
    const event = {};
    getCookieMock.mockReturnValueOnce('token');
    mockVerify.mockReturnValueOnce({ id: 1 });
    mocks.findUnique.mockResolvedValueOnce({ id: 1, userName: 'u', password: 'pwd' });
    
    const response = await handler(event);
    
    expect(response).toMatchObject({
      statusCode: 200,
      data: { id: 1, userName: 'u', accessToken: 'mock-token', refreshToken: 'mock-token' }
    });
  });
});
