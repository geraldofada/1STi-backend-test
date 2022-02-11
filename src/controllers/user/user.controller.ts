import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import prisma from '../../clients/prisma.client';
// import redis from '../../clients/redis.client';

import * as validator from './user.validator';
import * as userRepo from './user.repository';

import * as jsend from '../../utils/jsend.util';
import hashString from '../../utils/crypto.utils';

const login = async (req: Request, res: Response) => {};
const signup = async (req: Request, res: Response) => {};

const create = async (req: Request, res: Response) => {
  const { value, error } = validator.create.validate(req.body);
  if (error) return jsend.fail(res, 400, error);

  try {
    const hashPassword = await hashString(value.password);

    const { address, role, ...userInfo } = value;
    const user = await prisma.user.create({
      data: {
        ...userInfo,
        password: hashPassword,
        roles: {
          create: {
            role,
          },
        },
        address: {
          create: {
            ...address,
          },
        },
      },
      select: {
        id: true,
      },
    });

    return jsend.success(res, 201, user);
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      return jsend.fail(res, 400, err.message);
    }

    if (err instanceof Error) {
      return jsend.error(res, 500, 'An internal error occurred.', {
        code: 500,
        data: err.message,
      });
    }

    return jsend.error(res, 500, 'An internal error occurred.', null);
  }
};

const getById = async (req: Request, res: Response) => {
  const { value, error } = validator.getById.validate(req.params);
  if (error) return jsend.fail(res, 400, error);

  try {
    const user = await userRepo.getUser({ id: value.id });

    return jsend.success(res, 200, user);
  } catch (err) {
    if (err instanceof Error) {
      return jsend.error(res, 500, 'An internal error occurred.', {
        code: 500,
        data: err.message,
      });
    }

    return jsend.error(res, 500, 'An internal error occurred.', null);
  }
};

const getByCpf = async (req: Request, res: Response) => {
  const { value, error } = validator.getByCpf.validate(req.params);
  if (error) return jsend.fail(res, 400, error);

  try {
    const user = await userRepo.getUser({ cpf: value.cpf });

    return jsend.success(res, 200, user);
  } catch (err) {
    if (err instanceof Error) {
      return jsend.error(res, 500, 'An internal error occurred.', {
        code: 500,
        data: err.message,
      });
    }

    return jsend.error(res, 500, 'An internal error occurred.', null);
  }
};

const list = async (req: Request, res: Response) => {};
const update = async (req: Request, res: Response) => {};
const remove = async (req: Request, res: Response) => {};

export { login, signup, create, getById, getByCpf, list, update, remove };
