import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import config from '../config/config';
interface TokenPayload {
  userId: string;
  email: string;
  role: string | undefined;
}

export class AuthService {

  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(
      payload,
      config.jwt.secret as Secret,
      {
        expiresIn: config.jwt.expiresIn,
      } as SignOptions
    );
  }

  generateRefreshToken(payload: TokenPayload): string {
    if (!config.jwt.refreshSecret) {
      throw new Error('JWT_REFRESH_SECRET not configured');
    }
    
    return jwt.sign(
      payload,
      config.jwt.refreshSecret as Secret,
      {
        expiresIn: config.jwt.refreshExpiresIn || '7d',
      } as SignOptions
    );
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, config.jwt.secret as Secret);
      return decoded as TokenPayload;
    } catch (error) {
      throw new Error('Token invalid or expired');
    }
  }

  verifyRefreshToken(token: string): TokenPayload {
    try {
      if (!config.jwt.refreshSecret) {
        throw new Error('JWT_REFRESH_SECRET not configured');
      }
      
      const decoded = jwt.verify(token, config.jwt.refreshSecret as Secret);
      return decoded as TokenPayload;
    } catch (error) {
      throw new Error('Refresh token invalid or expired');
    }
  }

  generateTokens(payload: TokenPayload) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }
}
