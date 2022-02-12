import { Prisma } from '@prisma/client';
import prisma from '../../clients/prisma.client';

type UserGet = { id: string } | { cpf: string };

type UserQuery = {
  cpf?: string;
  email?: string;
  name?: string;
  phone?: string;
  cep?: string;
  line1?: string;
  number?: string;
  line2?: string;
  city?: string;
  state?: string;
  district?: string;
  page?: number;
  limit?: number;
};

const userDefaultSelect = Prisma.validator<Prisma.UserArgs>()({
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

const getUser = async (key: UserGet) => {
  // NOTE(Geraldo): Vou deixar o where desse jeito
  //                porque facilita a extração para depois,
  //                caso precise usar o mesmo where em outras
  //                queries.
  const where = Prisma.validator<Prisma.UserWhereInput>()({
    ...key,
  });

  const user = await prisma.user.findUnique({
    where,
    select: userDefaultSelect.select,
  });

  return user;
};

const getUserList = async (query: UserQuery) => {
  const where = Prisma.validator<Prisma.UserWhereInput>()({
    name: { contains: query.name },
    cpf: { contains: query.cpf },
    email: { contains: query.email },
    phone: { contains: query.phone },
    address: {
      cep: { contains: query.cep },
      line1: { contains: query.line1 },
      number: { contains: query.number },
      line2: { contains: query.line2 },
      district: { contains: query.district },
      city: { contains: query.city },
      state: { contains: query.state },
    },
  });

  const skip =
    query.limit && query.page ? query.limit * (query.page - 1) : undefined;
  const take = query.limit && query.page ? query.limit * query.page : undefined;

  const user = await prisma.user.findMany({
    where,
    select: userDefaultSelect.select,
    skip,
    take,
  });

  return user;
};

type User = Prisma.PromiseReturnType<typeof getUser>;
type UserList = Prisma.PromiseReturnType<typeof getUserList>;

interface IUserRepository {
  getUser: (where: UserGet) => Promise<User>;
  getUserList: (where: UserQuery) => Promise<UserList>;
}

const userRepository: IUserRepository = {
  getUser,
  getUserList,
};

export default userRepository;
