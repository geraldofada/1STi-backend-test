import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import jwt from 'jsonwebtoken';

import * as validator from './user.validator';
import { IUserRepository } from './user.repository';

import * as jsend from '../../utils/jsend.util';
import { hashString, isHashCorrect } from '../../utils/crypto.utils';
import { IAuthRepository } from '../auth/auth.repository';

type ExpressRouterFunc = (
  req: Request,
  res: Response,
  next?: NextFunction
) => void | Promise<void>;

const login = async (
  req: Request,
  res: Response,
  authReporitory: IAuthRepository
) => {
  const { error, value } = validator.login.validate(req.body);
  if (error) {
    return jsend.fail(res, 400, error);
  }

  try {
    const user = (await authReporitory.getUserPassword({
      email: value.email,
    })) as { id: string; password: string };

    if (!user) {
      return jsend.fail(res, 400, {
        message: 'Invalid email or password',
      });
    }

    const isPasswordCorrect = await isHashCorrect(
      user.password,
      value.password
    );

    if (!isPasswordCorrect) {
      return jsend.fail(res, 400, {
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign(
      {
        user: {
          id: user.id,
        },
        createdAt: new Date(),
      },
      process.env.JWT_SECRET!,
      { expiresIn: '3h' }
    );

    return jsend.success(res, 201, token);
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

const signup = async (
  req: Request,
  res: Response,
  userRepository: IUserRepository
) => {
  const { value, error } = validator.signup.validate(req.body);
  if (error) return jsend.fail(res, 400, error);

  try {
    const hashPassword = await hashString(value.password);

    const { address, ...rest } = value;
    const user = await userRepository.createUser({
      ...rest,
      password: hashPassword,
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

const update = async (
  req: Request,
  res: Response,
  userRepository: IUserRepository
) => {
  const { value, error } = validator.update.validate({
    ...req.body,
    ...req.params,
  });
  if (error) return jsend.fail(res, 400, error);

  try {
    let hashPassword;
    if (value.password) hashPassword = await hashString(value.password);

    const { address, ...rest } = value;
    const user = await userRepository.updateUser({
      ...rest,
      password: hashPassword,
      address: {
        update: {
          ...address,
        },
      },
    });

    return jsend.success(res, 200, user);
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
const remove = async (
  req: Request,
  res: Response,
  userRepository: IUserRepository
) => {
  const { value, error } = validator.remove.validate(req.params);
  if (error) return jsend.fail(res, 400, error);

  try {
    const user = await userRepository.deleteUser({ id: value.id });

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

const loginController =
  (authRepo: IAuthRepository): ExpressRouterFunc =>
  async (req: Request, res: Response) => {
    await login(req, res, authRepo);
  };

const signupController =
  (userRepo: IUserRepository): ExpressRouterFunc =>
  async (req: Request, res: Response) => {
    await signup(req, res, userRepo);
  };

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

const updateController =
  (userRepo: IUserRepository): ExpressRouterFunc =>
  async (req: Request, res: Response) => {
    await update(req, res, userRepo);
  };

const deleteController =
  (userRepo: IUserRepository): ExpressRouterFunc =>
  async (req: Request, res: Response) => {
    remove(req, res, userRepo);
  };

export {
  loginController,
  signupController,
  getByIdController,
  getByCpfController,
  listController,
  createController,
  updateController,
  deleteController,
};
