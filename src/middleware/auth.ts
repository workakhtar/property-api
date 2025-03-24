import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';
import { config } from '../config/config';
import { CustomJwtPayload } from '../types/jwt';

declare global {
  namespace Express {
    interface User extends CustomJwtPayload {}
  }
}

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.secret as string,
};

passport.use(
  new JwtStrategy(jwtOptions, async (payload: CustomJwtPayload, done: VerifiedCallback) => {
    try {
      // Verify user exists in database here
      return done(null, payload);
    } catch (error) {
      return done(error as Error, false);
    }
  })
);

export const authenticateJWT = passport.authenticate('jwt', { session: false });

export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    next();
  };
};