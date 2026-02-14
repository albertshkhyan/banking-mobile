export type LoginRequestDto = {
  email: string;
  password: string;
};

export type RegisterRequestDto = {
  name: string;
  email: string;
  password: string;
};

export type AuthUserDto = {
  id: string;
  name: string;
  email?: string;
};

/** Legacy shape (auth/me). Prefer LoginResponseDto for login. */
export type AuthResponseDto = {
  user: AuthUserDto;
  token?: string;
};

export type LoginResponseDto = {
  user: AuthUserDto;
  accessToken: string;
  refreshToken: string;
};

export type RefreshRequestDto = {
  refreshToken: string;
};

export type RefreshResponseDto = {
  accessToken: string;
  refreshToken: string;
};
