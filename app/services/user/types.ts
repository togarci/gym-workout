export interface User {
  id: number;
  userName: string;
  email?: string | null;
  name?: string | null;
  roleId?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginPayload {
  email?: string;
  userName?: string;
  password?: string;
}

export interface LoginResponse {
  statusCode: number;
  data: User & {
    accessToken: string;
    refreshToken: string;
  };
  message: string;
}

export interface RegisterPayload {
  userName: string;
  email?: string;
  password?: string;
  name?: string;
}

export type RegisterResponse = User;

export interface RevalidateResponse {
  statusCode: number;
  data: User & {
    accessToken: string;
    refreshToken: string;
  };
  message: string;
}

export interface UpdateUserPayload {
  id: number;
  userName?: string;
  email?: string;
  name?: string;
}

export type UpdateUserResponse = User;

export interface DeleteUserPayload {
  id: number;
}

export interface DeleteUserResponse {
  status: string;
}
