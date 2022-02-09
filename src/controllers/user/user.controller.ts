import { Request, Response } from 'express';

import { PrismaClientValidationError, PrismaClientKnownRequestError } from '@prisma/client/runtime';
import prisma from '../../clients/prisma.client';

import * as jsend from '../../utils/jsend.util';

// import redis from '../../clients/redis.client';

import * as validator from './user.validator';

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
        addresses: {
          create: {
            ...address,
          },
        },
      },
    });

    return jsend.success(res, 201, user);
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      return jsend.fail(res, 400, err.message);
    }

    if (err instanceof PrismaClientValidationError) {
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

const getById = async (req: Request, res: Response) => {};
const getByCpf = async (req: Request, res: Response) => {};
const list = async (req: Request, res: Response) => {};
const update = async (req: Request, res: Response) => {};
const remove = async (req: Request, res: Response) => {};

export { login, signup, create, getById, getByCpf, list, update, remove };
