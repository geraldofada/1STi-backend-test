import { Request, Response } from 'express';
import { mock } from 'jest-mock-extended';

import {
  IAddressRepository,
  addressRepository,
} from '../src/controllers/address/address.repository';
import addressController from '../src/controllers/address/address.controller';
import addressValidator from '../src/controllers/address/address.validator';

import { IViacepService } from '../src/services/viacep/viacep.service';

import redis from '../src/clients/redis.client';

describe('Address Repository', () => {
  const addressInfoTest = {
    cep: '24120344',
    logradouro: 'Alameda São Boaventura',
    complemento: 'de 1048 ao fim - lado par',
    bairro: 'Fonseca',
    localidade: 'Niterói',
    uf: 'RJ',
    ibge: '3303302',
    gia: '',
    ddd: '21',
    siafi: '5865',
  };

  afterAll(async () => {
    await redis.disconnect();
  });

  test('it should set a cep', async () => {
    await expect(
      addressRepository.setAddressCached(
        { cep: addressInfoTest.cep },
        addressInfoTest
      )
    ).resolves.toEqual(addressInfoTest);
  });

  test('it should get a cep if it exists', async () => {
    await expect(
      addressRepository.getAddressCached({ cep: addressInfoTest.cep })
    ).resolves.toEqual(addressInfoTest);
  });

  test('it should return null if it does not exists', async () => {
    await expect(
      addressRepository.getAddressCached({ cep: '20950005' })
    ).resolves.toEqual(null);
  });
});

describe('Address Controller', () => {
  const addressInfoTest = {
    cep: '24120344',
    logradouro: 'Alameda São Boaventura',
    complemento: 'de 1048 ao fim - lado par',
    bairro: 'Fonseca',
    localidade: 'Niterói',
    uf: 'RJ',
    ibge: '3303302',
    gia: '',
    ddd: '21',
    siafi: '5865',
  };

  const mockAddressRepo = mock<IAddressRepository>();
  const mockViacepRepo = mock<IViacepService>();

  mockAddressRepo.setAddressCached.mockResolvedValue(addressInfoTest);
  mockAddressRepo.getAddressCached.mockResolvedValue(addressInfoTest);
  mockViacepRepo.fetchAddressByCep.mockResolvedValue(addressInfoTest);

  describe('[GET] /address/cep/:cep', () => {
    describe('200', () => {
      const controller = addressController(mockAddressRepo, mockViacepRepo);

      const mockReq = mock<Request>();
      const mockRes = mock<Response>();

      mockRes.status.mockReturnThis();
      mockRes.json.mockReturnThis();

      mockReq.params = {
        cep: addressInfoTest.cep,
      };

      beforeAll(async () => {
        await controller(mockReq, mockRes);
      });

      test('it should return 200 if an address was found', () => {
        expect(mockRes.status).toHaveBeenCalledWith(200);
      });

      test('it should return an address', () => {
        expect(mockRes.json).toHaveBeenCalledWith({
          status: 'success',
          data: addressInfoTest,
        });
      });
    });

    describe('400', () => {
      const controller = addressController(mockAddressRepo, mockViacepRepo);

      const mockReq = mock<Request>();
      const mockRes = mock<Response>();

      mockRes.status.mockReturnThis();
      mockRes.json.mockReturnThis();

      mockReq.params = {
        id: addressInfoTest.cep,
      };

      const { error } = addressValidator.validate(mockReq.params);

      beforeAll(async () => {
        await controller(mockReq, mockRes);
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
      const controller = addressController(mockAddressRepo, mockViacepRepo);

      const mockReq = mock<Request>();
      const mockRes = mock<Response>();

      mockRes.status.mockReturnThis();
      mockRes.json.mockReturnThis();

      mockReq.params = {
        cep: addressInfoTest.cep,
      };

      test('it should return 500 if an Error was thrown', async () => {
        mockAddressRepo.getAddressCached.mockRejectedValueOnce(
          new Error('Internal error')
        );
        await controller(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
      });
    });
  });
});
