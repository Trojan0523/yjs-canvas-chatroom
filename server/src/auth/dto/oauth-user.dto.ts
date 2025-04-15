export interface OAuthUserData {
  providerId: string;
  provider: string;
  email: string;
  username: string;
  displayName?: string;
  photo?: string;
}
