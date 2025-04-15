export interface User {
  id: string;
  username: string;
  email: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  providerId?: string;
  provider?: string;
  photo?: string;
  displayName?: string;
  entryTokens?: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
