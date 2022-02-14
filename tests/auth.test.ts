import { Request, Response } from 'express';
import { Role } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';

import { mock } from 'jest-mock-extended';

import { userRepository } from '../src/controllers/user/user.repository';
import {
  IAuthRepository,
  authRepository,
} from '../src/controllers/auth/auth.repository';

import authMiddleware from '../src/middlewares/auth.middleware';

describe('Auth Repository', () => {
  const userIdTest1 = uuid();
  const userCpfTest1 = '99245152006';
  const userInfoTest1 = {
    id: userIdTest1,
    name: 'Geraldo auth',
    cpf: userCpfTest1,
    email: 'auth@teste.com',
    phone: '11223344551',
    password: '12345678',
    created_at: new Date(),
    updated_at: new Date(),
  };
  const addressInfoTest1 = {
    cep: '09500005',
    line1: 'Rua tal',
    number: '222',
    line2: '123123',
    district: 'Copa',
    city: 'Rio de Janeiro',
    state: 'RJ',
  };
  const roleInfoTest1 = { role: Role.ADMIN };

  beforeAll(async () => {
    const userInput = {
      ...userInfoTest1,
      address: {
        create: addressInfoTest1,
      },
      roles: {
        create: roleInfoTest1,
      },
    };
    await userRepository.createUser(userInput);
  });

  test('it should return an user if it belongs to the role specified', async () => {
    await expect(
      authRepository.getUserIfRole({ id: userIdTest1, roles: ['ADMIN'] })
    ).resolves.toEqual({ id: userIdTest1 });
  });

  test('it should not return an user if it not belongs to the role specified', async () => {
    await expect(
      authRepository.getUserIfRole({ id: userIdTest1, roles: ['USER'] })
    ).resolves.toEqual(null);
  });

  test('it should return an user password if it exists', async () => {
    await expect(
      authRepository.getUserPassword({ id: userIdTest1 })
    ).resolves.toEqual({ id: userIdTest1, password: userInfoTest1.password });
  });
});

describe('Auth Middleware', () => {
  const userIdTest1 = uuid();

  const mockAuthRepo = mock<IAuthRepository>();
  mockAuthRepo.getUserIfRole.mockResolvedValue({
    id: userIdTest1,
  });
  const middleware = authMiddleware(['USER'], mockAuthRepo);

  const mockReq = mock<Request>();
  const mockRes = mock<Response>();
  const mockNext = jest.fn();

  mockRes.status.mockReturnThis();
  mockRes.json.mockReturnThis();

  const token = jwt.sign(
    {
      user: {
        id: userIdTest1,
      },
      createdAt: new Date(),
    },
    process.env.JWT_SECRET!,
    { expiresIn: '3h' }
  );

  mockReq.headers.authorization = token;

  test('it should call next if everything went ok', async () => {
    await middleware(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalled();
  });

  test('it should return 401 if the token was not provided', async () => {
    mockReq.headers.authorization = undefined;
    await middleware(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
  });

  test('it should return 401 if the user was not found', async () => {
    mockAuthRepo.getUserIfRole.mockResolvedValue(null);
    await middleware(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
  });

  test('it should return 401 if the token was not verified', async () => {
    mockReq.headers.authorization = '1234';
    await middleware(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
  });
});
