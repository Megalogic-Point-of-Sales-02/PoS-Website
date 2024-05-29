export interface ForgotPasswordRequest {
  email: string;
  reset_token: string;
  reset_token_expiration: Date;
}
