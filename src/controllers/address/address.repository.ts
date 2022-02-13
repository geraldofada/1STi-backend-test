import redis from '../../clients/redis.client';

type AddressGet = { cep: string };

const getAddressCached = async (key: AddressGet) => {
  const cached = await redis.get(key.cep);

  if (cached) return JSON.parse(cached);

  return null;
};

const setAddressCached = async (key: AddressGet, value: Object) => {
  const valueStringified = JSON.stringify(value);
  await redis.set(key.cep, valueStringified);
  return value;
};

interface IAddressRepository {
  getAddressCached: (key: AddressGet) => Promise<Object>;
  setAddressCached: (key: AddressGet, value: Object) => Promise<Object>;
}

const addressRepository: IAddressRepository = {
  getAddressCached,
  setAddressCached,
};

export { IAddressRepository, addressRepository };
