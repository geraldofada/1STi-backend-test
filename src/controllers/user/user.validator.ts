import JoiImported from 'joi';
import cpfValidator from 'cpf-cnpj-validator';

import { Role } from '@prisma/client';

const Joi = JoiImported.extend(cpfValidator);

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const signup = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  cpf: Joi.document()
    .pattern(/^[0-9]+$/, 'numbers')
    .cpf()
    .max(11)
    .min(11)
    .required(),
  password: Joi.string().required(),
  passwordConfirmation: Joi.string().required().valid(Joi.ref('password')),
  phone: Joi.string()
    .pattern(/^[0-9]+$/, 'numbers')
    .max(11)
    .min(11)
    .required(),
  address: Joi.object({
    cep: Joi.string().required().max(8).min(8),
    line1: Joi.string().required(),
    number: Joi.string().required(),
    line2: Joi.string(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    district: Joi.string().required(),
  }).required(),
});

const create = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  cpf: Joi.document()
    .pattern(/^[0-9]+$/, 'numbers')
    .cpf()
    .max(11)
    .min(11)
    .required(),
  password: Joi.string().required(),
  role: Joi.string().valid(...Object.values(Role)),
  phone: Joi.string()
    .pattern(/^[0-9]+$/, 'numbers')
    .max(11)
    .min(11)
    .required(),
  address: Joi.object({
    cep: Joi.string().required().max(8).min(8),
    line1: Joi.string().required(),
    number: Joi.string().required(),
    line2: Joi.string(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    district: Joi.string().required(),
  }).required(),
});

const list = Joi.object({
  cpf: Joi.string(),
  email: Joi.string(),
  name: Joi.string(),
  phone: Joi.string(),
  cep: Joi.string(),
  line1: Joi.string(),
  number: Joi.string(),
  line2: Joi.string(),
  city: Joi.string(),
  state: Joi.string(),
  district: Joi.string(),
  page: Joi.number(),
  limit: Joi.number(),
});

const update = Joi.object({
  id: Joi.string()
    .guid({
      version: ['uuidv4'],
    })
    .required(),
  name: Joi.string(),
  email: Joi.string().email(),
  cpf: Joi.document()
    .pattern(/^[0-9]+$/, 'numbers')
    .cpf()
    .max(11)
    .min(11),
  password: Joi.string(),
  address: Joi.object({
    cep: Joi.string().max(8).min(8),
    line1: Joi.string(),
    number: Joi.string(),
    line2: Joi.string(),
    city: Joi.string(),
    state: Joi.string(),
    district: Joi.string(),
  }),
});

const getById = Joi.object({
  id: Joi.string()
    .guid({
      version: ['uuidv4'],
    })
    .required(),
});

const getByCpf = Joi.object({
  cpf: Joi.document()
    .pattern(/^[0-9]+$/, 'numbers')
    .cpf()
    .max(11)
    .min(11)
    .required(),
});

const remove = Joi.object({
  id: Joi.string()
    .guid({
      version: ['uuidv4'],
    })
    .required(),
});

export { signup, login, create, list, getById, getByCpf, update, remove };
