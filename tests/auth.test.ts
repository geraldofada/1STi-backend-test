import { Role } from '@prisma/client';
import { v4 as uuid } from 'uuid';

import { userRepository } from '../src/controllers/user/user.repository';
import { authRepository } from '../src/controllers/auth/auth.repository';

describe('User Repository', () => {
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
