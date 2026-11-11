export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  userName?: string | null;
  isActive: boolean;
  preferredLanguage: string;
  roles: string[];
  lastLoginAt?: string | null;
}

export interface ApiResult<T> {
  success: boolean;
  data?: T;
  message?: string;
  fieldErrors?: Array<{ field: string; message: string }>;
}
