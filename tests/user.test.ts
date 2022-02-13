import { Role } from '@prisma/client';
import { Request, Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { v4 as uuid } from 'uuid';
import { mock } from 'jest-mock-extended';

import {
  userRepository,
  IUserRepository,
} from '../src/controllers/user/user.repository';

import * as userController from '../src/controllers/user/user.controller';
import * as userValidator from '../src/controllers/user/user.validator';

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

  // NOTE(Geraldo): to mandando o updateAt pra conseguir comparar o resultado depois
  const updatedAtTeste1 = new Date();

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

  test('it should return a list of users by address filtering', async () => {
    await expect(
      userRepository.getUserList({ cpf: userCpfTest1, cep: '09500005' })
    ).resolves.toEqual([userReturnTest1]);
  });

  test('it should update and return the updated user', async () => {
    const userInfo = {
      name: 'Geraldo Update',
      email: 'teste29@teste.com',
      updated_at: updatedAtTeste1,
    };
    const addressInfo = {
      cep: '09500009',
      line1: 'Rua la',
      number: '111',
    };

    const userUpdateInput = {
      id: userIdTest1,
      ...userInfo,
      address: {
        update: addressInfo,
      },
    };

    const { password: _pass1, ...restTest1 } = userInfoTest1;
    const userReturn = {
      ...restTest1,
      name: 'Geraldo Update',
      email: 'teste29@teste.com',
      updated_at: updatedAtTeste1,
      address: {
        ...addressInfoTest1,
        cep: '09500009',
        line1: 'Rua la',
        number: '111',
      },
      roles: [roleInfoTest1],
    };

    await expect(userRepository.updateUser(userUpdateInput)).resolves.toEqual(
      userReturn
    );
  });

  test('it should delete an user and return the deleted record', async () => {
    const { password: _pass1, ...restTest1 } = userInfoTest1;
    const userReturn = {
      ...restTest1,
      name: 'Geraldo Update',
      email: 'teste29@teste.com',
      updated_at: updatedAtTeste1,
      address: {
        ...addressInfoTest1,
        cep: '09500009',
        line1: 'Rua la',
        number: '111',
      },
      roles: [roleInfoTest1],
    };

    await expect(
      userRepository.deleteUser({ id: userIdTest1 })
    ).resolves.toEqual(userReturn);
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
  mockUserRepo.getUser.mockResolvedValue({
    ...mockUserInfo,
    address: mockAddressInfo,
    roles: [mockRoleInfo],
  });

  describe('[POST] /user', () => {
    describe('201', () => {
      const {
        id: _id,
        created_at: _created,
        updated_at: _updated,
        ...rest
      } = mockUserInfo;

      const createController = userController.createController(mockUserRepo);

      const mockReq = mock<Request>();
      const mockRes = mock<Response>();

      mockRes.status.mockReturnThis();
      mockRes.json.mockReturnThis();

      mockReq.body = {
        ...rest,
        address: mockAddressInfo,
        role: mockRoleInfo.role,
      };

      beforeAll(async () => {
        await createController(mockReq, mockRes);
      });

      test('it should return 201 if an user was created', () => {
        expect(mockRes.status).toHaveBeenCalledWith(201);
      });

      test('it should return an user', () => {
        expect(mockRes.json).toHaveBeenCalledWith({
          status: 'success',
          data: {
            ...mockUserInfo,
            address: mockAddressInfo,
            roles: [mockRoleInfo],
          },
        });
      });
    });

    describe('400', () => {
      const createController = userController.createController(mockUserRepo);

      const mockReq = mock<Request>();
      const mockRes = mock<Response>();

      mockRes.status.mockReturnThis();
      mockRes.json.mockReturnThis();

      mockReq.body = {
        id: '1',
      };

      const { error } = userValidator.create.validate(mockReq.body);

      beforeAll(async () => {
        await createController(mockReq, mockRes);
      });

      test('it should return 400 if the validator have failed', () => {
        expect(mockRes.status).toHaveBeenCalledWith(400);
      });

      test('it should return an error message from Joi', () => {
        expect(mockRes.json).toHaveBeenCalledWith({
          status: 'fail',
          data: error,
        });
      });

      test('it should return 400 if a prisma validation error was thrown', async () => {
        const mockReq2 = mock<Request>();
        const {
          id: _id,
          created_at: _created,
          updated_at: _updated,
          ...rest
        } = mockUserInfo;

        mockReq2.body = {
          ...rest,
          address: mockAddressInfo,
          role: mockRoleInfo.role,
        };

        mockUserRepo.createUser.mockRejectedValueOnce(
          new PrismaClientKnownRequestError(
            'user create error',
            'P2002',
            'client version'
          )
        );

        await createController(mockReq2, mockRes);
        expect(mockRes.status).toHaveBeenLastCalledWith(400);
      });
    });

    describe('500', () => {
      const {
        id: _id,
        created_at: _created,
        updated_at: _updated,
        ...rest
      } = mockUserInfo;

      const createController = userController.createController(mockUserRepo);

      const mockReq = mock<Request>();
      const mockRes = mock<Response>();

      mockRes.status.mockReturnThis();
      mockRes.json.mockReturnThis();

      mockReq.body = {
        ...rest,
        address: mockAddressInfo,
        role: mockRoleInfo.role,
      };

      test('it should return 500 if an Error was thrown', async () => {
        mockUserRepo.createUser.mockRejectedValueOnce(
          new Error('Internal error')
        );
        await createController(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
      });
    });
  });

  describe('[POST] /user/signup', () => {
    describe('201', () => {
      const {
        id: _id,
        created_at: _created,
        updated_at: _updated,
        ...rest
      } = mockUserInfo;

      const signupController = userController.signupController(mockUserRepo);

      const mockReq = mock<Request>();
      const mockRes = mock<Response>();

      mockRes.status.mockReturnThis();
      mockRes.json.mockReturnThis();

      mockReq.body = {
        ...rest,
        passwordConfirmation: rest.password,
        address: mockAddressInfo,
      };

      beforeAll(async () => {
        await signupController(mockReq, mockRes);
      });

      test('it should return 201 if an user was created', () => {
        expect(mockRes.status).toHaveBeenCalledWith(201);
      });

      test('it should return an user', () => {
        expect(mockRes.json).toHaveBeenCalledWith({
          status: 'success',
          data: {
            ...mockUserInfo,
            address: mockAddressInfo,
            roles: [mockRoleInfo],
          },
        });
      });
    });

    describe('400', () => {
      const signupController = userController.signupController(mockUserRepo);

      const mockReq = mock<Request>();
      const mockRes = mock<Response>();

      mockRes.status.mockReturnThis();
      mockRes.json.mockReturnThis();

      mockReq.body = {
        id: '1',
      };

      const { error } = userValidator.signup.validate(mockReq.body);

      beforeAll(async () => {
        await signupController(mockReq, mockRes);
      });

      test('it should return 400 if the validator have failed', () => {
        expect(mockRes.status).toHaveBeenCalledWith(400);
      });

      test('it should return an error message from Joi', () => {
        expect(mockRes.json).toHaveBeenCalledWith({
          status: 'fail',
          data: error,
        });
      });

      test('it should return 400 if a prisma validation error was thrown', async () => {
        const mockReq2 = mock<Request>();
        const {
          id: _id,
          created_at: _created,
          updated_at: _updated,
          ...rest
        } = mockUserInfo;

        mockReq2.body = {
          ...rest,
          passwordConfirmation: rest.password,
          address: mockAddressInfo,
        };

        mockUserRepo.createUser.mockRejectedValueOnce(
          new PrismaClientKnownRequestError(
            'user create error',
            'P2002',
            'client version'
          )
        );

        await signupController(mockReq2, mockRes);
        expect(mockRes.status).toHaveBeenLastCalledWith(400);
      });
    });

    describe('500', () => {
      const {
        id: _id,
        created_at: _created,
        updated_at: _updated,
        ...rest
      } = mockUserInfo;

      const signupController = userController.signupController(mockUserRepo);

      const mockReq = mock<Request>();
      const mockRes = mock<Response>();

      mockRes.status.mockReturnThis();
      mockRes.json.mockReturnThis();

      mockReq.body = {
        ...rest,
        passwordConfirmation: rest.password,
        address: mockAddressInfo,
      };

      test('it should return 500 if an Error was thrown', async () => {
        mockUserRepo.createUser.mockRejectedValueOnce(
          new Error('Internal error')
        );
        await signupController(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
      });
    });
  });

  describe('[GET] /user/:id', () => {
    describe('200', () => {
      const getByIdController = userController.getByIdController(mockUserRepo);

      const mockReq = mock<Request>();
      const mockRes = mock<Response>();

      mockRes.status.mockReturnThis();
      mockRes.json.mockReturnThis();

      mockReq.params = {
        id: mockUserInfo.id,
      };

      beforeEach(async () => {
        await getByIdController(mockReq, mockRes);
      });

      test('it should return 200 if an user was returned', () => {
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
          status: 'success',
          data: {
            ...mockUserInfo,
            address: mockAddressInfo,
            roles: [mockRoleInfo],
          },
        });
      });

      test('it should return 200 if no user was found', async () => {
        mockUserRepo.getUser.mockResolvedValueOnce(null);

        await getByIdController(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
          status: 'success',
          data: null,
        });
      });
    });

    describe('400', () => {
      const getByIdController = userController.getByIdController(mockUserRepo);

      const mockReq = mock<Request>();
      const mockRes = mock<Response>();

      mockRes.status.mockReturnThis();
      mockRes.json.mockReturnThis();

      mockReq.params = {
        id: '1',
      };

      const { error } = userValidator.getById.validate(mockReq.params);

      beforeAll(async () => {
        await getByIdController(mockReq, mockRes);
      });

      test('it should return 400 if the validator have failed', () => {
        expect(mockRes.status).toHaveBeenCalledWith(400);
      });

      test('it should return an error message from Joi', () => {
        expect(mockRes.json).toHaveBeenCalledWith({
          status: 'fail',
          data: error,
        });
      });
    });

    describe('500', () => {
      const getByIdController = userController.getByIdController(mockUserRepo);

      const mockReq = mock<Request>();
      const mockRes = mock<Response>();

      mockRes.status.mockReturnThis();
      mockRes.json.mockReturnThis();

      mockReq.params = {
        id: mockUserInfo.id,
      };

      test('it should return 500 if an Error was thrown', async () => {
        mockUserRepo.getUser.mockRejectedValueOnce(new Error('Internal error'));
        await getByIdController(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
      });
    });
  });

  describe('[GET] /user/cpf/:cpf', () => {
    describe('200', () => {
      const getByCpfController =
        userController.getByCpfController(mockUserRepo);

      const mockReq = mock<Request>();
      const mockRes = mock<Response>();

      mockRes.status.mockReturnThis();
      mockRes.json.mockReturnThis();

      mockReq.params = {
        cpf: mockUserInfo.cpf,
      };

      beforeEach(async () => {
        await getByCpfController(mockReq, mockRes);
      });

      test('it should return 200 if an user was returned', () => {
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
          status: 'success',
          data: {
            ...mockUserInfo,
            address: mockAddressInfo,
            roles: [mockRoleInfo],
          },
        });
      });

      test('it should return 200 if no user was found', async () => {
        mockUserRepo.getUser.mockResolvedValueOnce(null);

        await getByCpfController(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({
          status: 'success',
          data: null,
        });
      });
    });

    describe('400', () => {
      const getByCpfController =
        userController.getByCpfController(mockUserRepo);

      const mockReq = mock<Request>();
      const mockRes = mock<Response>();

      mockRes.status.mockReturnThis();
      mockRes.json.mockReturnThis();

      mockReq.params = {
        cpf: '1',
      };

      const { error } = userValidator.getByCpf.validate(mockReq.params);

      beforeAll(async () => {
        await getByCpfController(mockReq, mockRes);
      });

      test('it should return 400 if the validator have failed', () => {
        expect(mockRes.status).toHaveBeenCalledWith(400);
      });

      test('it should return an error message from Joi', () => {
        expect(mockRes.json).toHaveBeenCalledWith({
          status: 'fail',
          data: error,
        });
      });
    });

    describe('500', () => {
      const getByCpfController =
        userController.getByCpfController(mockUserRepo);

      const mockReq = mock<Request>();
      const mockRes = mock<Response>();

      mockRes.status.mockReturnThis();
      mockRes.json.mockReturnThis();

      mockReq.params = {
        cpf: mockUserInfo.cpf,
      };

      test('it should return 500 if an Error was thrown', async () => {
        mockUserRepo.getUser.mockRejectedValueOnce(new Error('Internal error'));
        await getByCpfController(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
      });
    });
  });
});
