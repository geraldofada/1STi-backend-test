// NOTE(Geraldo): More info about the jsend standard
// https://github.com/omniti-labs/jsend

import { Response } from 'express';

const success = (res: Response, status: number, data: Object | null): void => {
  const response = {
    status: 'success',
    data,
  };

  res.status(status).json(response);
};

const fail = (res: Response, status: number, data: Object | null): void => {
  const response = {
    status: 'fail',
    data,
  };

  res.status(status).json(response);
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
): void => {
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

  res.status(status).json(response);
};

export { success, fail, error };
