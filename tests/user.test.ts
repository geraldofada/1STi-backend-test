import { Role } from '@prisma/client';
import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { v4 as uuid } from 'uuid';
import { mock, mockDeep } from 'jest-mock-extended';

import {
  userRepository,
  IUserRepository,
} from '../src/controllers/user/user.repository';

import * as userController from '../src/controllers/user/user.controller';

describe('User Repository', () => {
  const userIdTest1 = uuid();
  const userCpfTest1 = '66611394034';
  const userInfoTest1 = {
    id: userIdTest1,
    name: 'Geraldo',
    cpf: userCpfTest1,
    email: 'teste0@teste.com',
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
  const roleInfoTest1 = { role: Role.USER };

  const { password: _, ...rest } = userInfoTest1;
  const userReturnTest1 = {
    ...rest,
    address: addressInfoTest1,
    roles: [roleInfoTest1],
  };

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

  test('it should create and return an user', async () => {
    const id = uuid();
    const userInfo = {
      id,
      name: 'Geraldo',
      cpf: '66677394034',
      email: 'teste1@teste.com',
      phone: '11223344551',
      password: '12345678',
      created_at: new Date(),
      updated_at: new Date(),
    };
    const addressInfo = {
      cep: '09500005',
      line1: 'Rua tal',
      number: '222',
      line2: '123123',
      district: 'Copa',
      city: 'Rio de Janeiro',
      state: 'RJ',
    };
    const roleInfo = { role: Role.USER };

    const userInput = {
      ...userInfo,
      address: {
        create: addressInfo,
      },
      roles: {
        create: roleInfo,
      },
    };

    const { password: _pass1, ...restTest1 } = userInfo;
    const userReturn = {
      ...restTest1,
      address: addressInfo,
      roles: [roleInfo],
    };

    await expect(userRepository.createUser(userInput)).resolves.toEqual(
      userReturn
    );
  });

  test('it should have cpf as an unique column', async () => {
    const id = uuid();
    const userInfo = {
      id,
      name: 'Geraldo',
      cpf: '66677394034',
      email: 'teste2@teste.com',
      phone: '11223344551',
      password: '12345678',
      created_at: new Date(),
      updated_at: new Date(),
    };
    const addressInfo = {
      cep: '09500005',
      line1: 'Rua tal',
      number: '222',
      line2: '123123',
      district: 'Copa',
      city: 'Rio de Janeiro',
      state: 'RJ',
    };
    const roleInfo = { role: Role.USER };

    const userInput = {
      ...userInfo,
      address: {
        create: addressInfo,
      },
      roles: {
        create: roleInfo,
      },
    };

    await expect(userRepository.createUser(userInput)).rejects.toThrow(
      PrismaClientKnownRequestError
    );
  });

  test('it should have email as an unique column', async () => {
    const id = uuid();
    const userInfo = {
      id,
      name: 'Geraldo',
      cpf: '12312312311',
      email: 'teste0@teste.com',
      phone: '11223344551',
      password: '12345678',
      created_at: new Date(),
      updated_at: new Date(),
    };
    const addressInfo = {
      cep: '09500005',
      line1: 'Rua tal',
      number: '222',
      line2: '123123',
      district: 'Copa',
      city: 'Rio de Janeiro',
      state: 'RJ',
    };
    const roleInfo = { role: Role.USER };

    const userInput = {
      ...userInfo,
      address: {
        create: addressInfo,
      },
      roles: {
        create: roleInfo,
      },
    };

    await expect(userRepository.createUser(userInput)).rejects.toThrow(
      PrismaClientKnownRequestError
    );
  });

  test('it should return one user by id', async () => {
    await expect(userRepository.getUser({ id: userIdTest1 })).resolves.toEqual(
      userReturnTest1
    );
  });

  test('it should return one user by cpf', async () => {
    await expect(
      userRepository.getUser({ cpf: userCpfTest1 })
    ).resolves.toEqual(userReturnTest1);
  });

  test('it should return a list of users', async () => {
    await expect(
      userRepository.getUserList({ cpf: userCpfTest1 })
    ).resolves.toEqual([userReturnTest1]);
  });
});

describe('User Controller', () => {
  const id = uuid();
  const mockUserInfo = {
    id,
    name: 'Geraldo',
    cpf: '78055548030',
    email: 'teste0@teste.com',
    phone: '11223344551',
    password: '12345678',
    created_at: new Date(),
    updated_at: new Date(),
  };
  const mockAddressInfo = {
    cep: '09500005',
    line1: 'Rua tal',
    number: '222',
    line2: '123123',
    district: 'Copa',
    city: 'Rio de Janeiro',
    state: 'RJ',
  };
  const mockRoleInfo = { role: Role.USER };

  const mockUserRepo = mock<IUserRepository>();
  mockUserRepo.createUser.mockResolvedValue({
    ...mockUserInfo,
    address: mockAddressInfo,
    roles: [mockRoleInfo],
  });

  const mockReq = mockDeep<Request>();
  const mockRes = mockDeep<Response>();

  describe('[POST] 201 /user', () => {
    const {
      id: _id,
      created_at: _created,
      updated_at: _updated,
      ...rest
    } = mockUserInfo;

    const createController = userController.createController(mockUserRepo);
    mockReq.body = {
      ...rest,
      address: mockAddressInfo,
      role: mockRoleInfo.role,
    };

    beforeAll(async () => {
      await createController(mockReq, mockRes);
    });

    test('it should return 201 if a user was created', async () => {
      mockRes.status.mockImplementationOnce((_code) => {
        return mockRes;
      });

      expect(mockRes.status.mockReturnThis()).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        ...mockUserInfo,
        address: mockAddressInfo,
        roles: [mockRoleInfo],
      });
    });

    test('it should return an user if 201 was the status', async () => {});
  });
});
