import type {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  RevalidateResponse,
  UpdateUserPayload,
  UpdateUserResponse,
  DeleteUserPayload,
  DeleteUserResponse,
} from './types';

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  return await $fetch<LoginResponse>('/api/user/login', {
    method: 'POST',
    body: payload,
  });
}

export async function registerUser(payload: RegisterPayload): Promise<RegisterResponse> {
  return await $fetch<RegisterResponse>('/api/user/register', {
    method: 'POST',
    body: payload,
  });
}

export async function revalidateToken(refreshToken?: string): Promise<RevalidateResponse> {
  const headers: Record<string, string> = {};
  if (refreshToken) {
    headers['x-refresh-token'] = refreshToken;
  }
  return await $fetch<RevalidateResponse>('/api/user/revalidate', {
    method: 'GET',
    headers,
  });
}

export async function updateUser(payload: UpdateUserPayload): Promise<UpdateUserResponse> {
  return await $fetch<UpdateUserResponse>('/api/user/update', {
    method: 'PUT',
    body: payload,
  });
}

export async function deleteUser(payload: DeleteUserPayload): Promise<DeleteUserResponse> {
  return await $fetch<DeleteUserResponse>('/api/user/delete', {
    method: 'DELETE',
    body: payload,
  });
}


export * from './types';
