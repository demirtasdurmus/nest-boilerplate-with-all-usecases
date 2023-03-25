import Joi from 'joi';

export const joiTestSchema = Joi.object({
  name: Joi.string().required(),
  value: Joi.number().required(),
});
