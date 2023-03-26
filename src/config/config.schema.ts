import Joi from 'joi';
import { IConfig } from './config.interface';

export const configValidationSchema = Joi.object<IConfig>({
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_NAME: Joi.string().required(),
  DB_AUTHSOURCE: Joi.string().required(),
  DB_USER: Joi.optional().default(''),
  DB_PASS: Joi.optional().default(''),
});
