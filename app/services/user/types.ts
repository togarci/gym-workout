export interface Personal {
  id: number;
  name?: string | null;
  userId: number;
}

export interface Global {
  id: number;
  name?: string | null;
  userId: number;
  personalId: number;
}

export interface User {
  id: number;
  userName: string;
  email?: string | null;
  roleId?: number | null;
  role?: { id: number; name: 'personal' | 'global' } | null;
  personal?: Personal | null;
  global?: Global | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterPayload {
  userName: string;
  email: string;
  password: string;
  name?: string;
}

export type RegisterResponse = User;

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
