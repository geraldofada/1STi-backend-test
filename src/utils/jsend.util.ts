// NOTE(Geraldo): More info about the jsend standard
// https://github.com/omniti-labs/jsend

import { Response } from 'express';

const success = (
  res: Response,
  status: number,
  data: Object | null
): Response => {
  const response = {
    status: 'success',
    data,
  };

  return res.status(status).json(response);
};

const fail = (res: Response, status: number, data: Object | null): Response => {
  const response = {
    status: 'fail',
    data,
  };

  return res.status(status).json(response);
};

type JsendOptional = {
  code: number;
  data: Object;
};
const error = (
  res: Response,
  status: number,
  message: string,
  optional: JsendOptional | null = null
): Response => {
  let response = {};
  if (optional) {
    const { code, data } = optional;
    response = {
      status: 'error',
      message,
      code,
      data,
    };
  } else {
    response = {
      status: 'error',
      message,
    };
  }

  return res.status(status).json(response);
};

export { success, fail, error };
