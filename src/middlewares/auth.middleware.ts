import jwt from 'jsonwebtoken';
import * as express from 'express';

import { Role } from '@prisma/client';

import { IAuthRepository } from '../controllers/auth/auth.repository';
import * as jsend from '../utils/jsend.util';

declare global {
  namespace Express {
    interface Request {
      userAuthId?: string;
    }
  }
}

type Token = {
  user: {
    id: string;
  };
};

const auth = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
  roles: Role[],
  authRepository: IAuthRepository
) => {
  if (!(req.headers && req.headers.authorization)) {
    return jsend.fail(res, 401, {
      message: 'Token was not provided',
    });
  }

  const token = req.headers.authorization;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as Token;

    const user = await authRepository.getUserIfRole({
      id: decoded.user.id,
      roles,
    });

    if (!user) {
      return jsend.fail(res, 401, {
        message: 'Unauthorized access',
      });
    }

    req.userAuthId = user.id;

    return next();
  } catch (error) {
    return jsend.fail(res, 401, {
      message: 'Incorrect token',
    });
  }
};

const authorize =
  (roles: Role[], authRepository: IAuthRepository) =>
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    await auth(req, res, next, roles, authRepository);
  };

export default authorize;
