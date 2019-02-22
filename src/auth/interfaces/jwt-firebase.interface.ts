export interface JwtFirebasePayload {
  aud: string;
  iat: number;
  exp: number;
  iss: string;
  sub: string;
  uid: string;
}
