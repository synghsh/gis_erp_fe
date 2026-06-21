export interface UserMain {
  userDetails?: any;
  token?: string | null;
}

export interface LoginAdminPayload {
  username: string;
  password: string;
}

export interface LoginAdminResponse {
  Data?: any;
  Token?: string;
  Message?: string;
}
