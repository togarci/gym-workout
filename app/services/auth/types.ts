import type { User } from '~/services/user/types';

export interface LoginPayload {
  email?: string;
  userName?: string;
  password?: string;
  personal?: boolean;
}

export interface LoginResponse {
  statusCode: number;
  data: User & {
    accessToken: string;
    refreshToken: string;
    isPersonal: boolean;
  };
  message: string;
}

export interface RevalidateResponse {
  statusCode: number;
  data: User & {
    accessToken: string;
    refreshToken: string;
    isPersonal?: boolean;
  };
  message: string;
}

export interface LogoutResponse {
  statusCode: number;
  message: string;
}
