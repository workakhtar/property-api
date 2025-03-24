import { Secret, SignOptions } from 'jsonwebtoken';

export interface JwtConfig {
  secret: Secret;
  expiresIn: SignOptions['expiresIn'];
}

export interface CustomJwtPayload {
  id: string;
  username: string;
  role: string;
}
