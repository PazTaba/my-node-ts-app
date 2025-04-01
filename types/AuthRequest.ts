import { Request } from 'express';

export interface JwtPayloadCustom {
  id: string;
  email: string;
  name: string;
  accountType: 'personal' | 'business';
  profileImageUrl?: string;
  radius: number;
  communityRating?: number;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
    headers: Request['headers'] & {
      authorization?: string;
    };
    user?: JwtPayloadCustom;
  }
