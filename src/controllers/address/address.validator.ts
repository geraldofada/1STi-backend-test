import Joi from 'joi';

const getByCep = Joi.object({
  cep: Joi.string().required().max(8).min(8),
});

export default getByCep;
