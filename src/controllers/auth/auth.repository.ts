import { Prisma, Role } from '@prisma/client';
import prisma from '../../clients/prisma.client';

type UserIfRole = { id: string; roles: Role[] };

type UserGet = Prisma.UserWhereUniqueInput;

const getUserIfRole = async (data: UserIfRole) => {
  const userAuth = prisma.user.findFirst({
    where: {
      id: data.id,
      roles: {
        some: {
          role: { in: data.roles },
        },
      },
    },
    select: {
      id: true,
    },
  });

  return userAuth;
};

const getUserPassword = async (id: UserGet) => {
  const userPassword = prisma.user.findUnique({
    where: {
      ...id,
    },
    select: {
      id: true,
      password: true,
    },
  });

  return userPassword;
};

type User =
  | Prisma.PromiseReturnType<typeof getUserIfRole>
  | Prisma.PromiseReturnType<typeof getUserPassword>;

interface IAuthRepository {
  getUserIfRole: (data: UserIfRole) => Promise<User>;
  getUserPassword: (data: UserGet) => Promise<User>;
}

const authRepository: IAuthRepository = {
  getUserIfRole,
  getUserPassword,
};

export { IAuthRepository, authRepository };
