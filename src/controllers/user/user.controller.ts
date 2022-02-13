import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

// import redis from '../../clients/redis.client';

import * as validator from './user.validator';
import { IUserRepository } from './user.repository';

import * as jsend from '../../utils/jsend.util';
import hashString from '../../utils/crypto.utils';

type ExpressRouterFunc = (
  req: Request,
  res: Response,
  next?: NextFunction
) => void | Promise<void>;

const login = async (req: Request, res: Response) => {};
const signup = async (req: Request, res: Response) => {};

const create = async (
  req: Request,
  res: Response,
  userRepository: IUserRepository
) => {
  const { value, error } = validator.create.validate(req.body);
  if (error) return jsend.fail(res, 400, error);

  try {
    const hashPassword = await hashString(value.password);

    const { address, role, ...rest } = value;
    const user = await userRepository.createUser({
      ...rest,
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

const getById = async (
  req: Request,
  res: Response,
  userRepository: IUserRepository
) => {
  const { value, error } = validator.getById.validate(req.params);
  if (error) return jsend.fail(res, 400, error);

  try {
    const user = await userRepository.getUser({ id: value.id });

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

const getByCpf = async (
  req: Request,
  res: Response,
  userRepository: IUserRepository
) => {
  const { value, error } = validator.getByCpf.validate(req.params);
  if (error) return jsend.fail(res, 400, error);

  try {
    const user = await userRepository.getUser({ cpf: value.cpf });

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

const list = async (
  req: Request,
  res: Response,
  userRepository: IUserRepository
) => {
  const { value, error } = validator.list.validate(req.query);
  if (error) return jsend.fail(res, 400, error);

  try {
    const userList = await userRepository.getUserList({
      ...value,
    });

    return jsend.success(res, 201, userList);
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

const update = async (req: Request, res: Response) => {};
const remove = async (req: Request, res: Response) => {};

const getByIdController =
  (userRepo: IUserRepository): ExpressRouterFunc =>
  async (req: Request, res: Response) => {
    await getById(req, res, userRepo);
  };

const getByCpfController =
  (userRepo: IUserRepository): ExpressRouterFunc =>
  async (req: Request, res: Response) => {
    await getByCpf(req, res, userRepo);
  };

const listController =
  (userRepo: IUserRepository): ExpressRouterFunc =>
  async (req: Request, res: Response) => {
    await list(req, res, userRepo);
  };

const createController =
  (userRepo: IUserRepository): ExpressRouterFunc =>
  async (req: Request, res: Response) => {
    await create(req, res, userRepo);
  };

export {
  getByIdController,
  getByCpfController,
  listController,
  createController,
};
