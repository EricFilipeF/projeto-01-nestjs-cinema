export interface AuthUser {
  email: string;
  name: string;
  role: string;
}

export interface AuthSession {
  accessToken: string;
  tokenType: string;
  user: AuthUser;
}

export interface LoginInput {
  email: string;
  password: string;
}