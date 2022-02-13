import axios from 'axios';

const fetchAddressByCep = async (cep: string) => {
  const address = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
  return address.data as Object;
};

interface IViacepService {
  fetchAddressByCep: (cep: string) => Promise<Object>;
}

const viacepService: IViacepService = {
  fetchAddressByCep,
};

export { IViacepService, viacepService };
