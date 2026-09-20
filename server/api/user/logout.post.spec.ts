import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.stubGlobal('defineEventHandler', vi.fn((handlerFn) => handlerFn));
vi.stubGlobal('deleteCookie', vi.fn());

const loadHandler = async () => {
  const mod = await import('./logout.post');
  return mod.default as any;
};

describe('POST /api/user/logout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete cookies and return success', async () => {
    const handler = await loadHandler();
    const event = {};
    
    const response = await handler(event);
    
    expect(deleteCookie).toHaveBeenCalledWith(event, 'accessToken', { path: '/' });
    expect(deleteCookie).toHaveBeenCalledWith(event, 'refreshToken', { path: '/' });
    expect(deleteCookie).toHaveBeenCalledWith(event, 'userName', { path: '/' });
    expect(response).toMatchObject({
      statusCode: 200,
      message: 'Logout realizado com sucesso.'
    });
  });
});
