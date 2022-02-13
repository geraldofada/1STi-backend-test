import { Request, Response, NextFunction } from 'express';
import { IAddressRepository } from './address.repository';

import validator from './address.validator';

import * as jsend from '../../utils/jsend.util';
import { IViacepService } from '../../services/viacep/viacep.service';

type ExpressRouterFunc = (
  req: Request,
  res: Response,
  next?: NextFunction
) => void | Promise<void>;

const getByCep = async (
  req: Request,
  res: Response,
  addressRepository: IAddressRepository,
  viacepService: IViacepService
) => {
  const { value, error } = validator.validate(req.params);
  if (error) return jsend.fail(res, 400, error);

  try {
    const address = await addressRepository.getAddressCached({
      cep: value.cep,
    });

    if (address) return jsend.success(res, 200, address);

    const addressFetched = await viacepService.fetchAddressByCep(value.cep);

    const addressCached = await addressRepository.setAddressCached(
      { cep: value.cep },
      addressFetched
    );

    return jsend.success(res, 200, addressCached);
  } catch (err) {
    if (err instanceof Error) {
      return jsend.error(res, 500, 'An internal error occurred.', {
        code: 500,
        data: err.message,
      });
    }

    return jsend.error(res, 500, 'An internal error occurred.', null);
  }
};

const getByCepController =
  (
    addressRepo: IAddressRepository,
    viacepService: IViacepService
  ): ExpressRouterFunc =>
  async (req: Request, res: Response) => {
    await getByCep(req, res, addressRepo, viacepService);
  };

export default getByCepController;
