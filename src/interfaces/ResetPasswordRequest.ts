export interface ResetPasswordRequest {
  password: string;
  confirm_password: string;
  reset_token?: string;
}
