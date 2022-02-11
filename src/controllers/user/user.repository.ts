import prisma from '../../clients/prisma.client';

type UserGet = { id: string } | { cpf: string };

// type UserQuery = {};

const getUser = async (where: UserGet) => {
  const user = await prisma.user.findUnique({
    where,
    select: {
      id: true,
      name: true,
      cpf: true,
      email: true,
      phone: true,
      created_at: true,
      updated_at: true,
      address: {
        select: {
          cep: true,
          line1: true,
          number: true,
          line2: true,
          district: true,
          city: true,
          state: true,
        },
      },
      roles: {
        select: {
          role: true,
        },
      },
    },
  });

  return user;
};

const getUserList = async () => {};

export { getUser, getUserList };
