import Joi from 'joi';
import { IConfig } from './config.interface';

export const configValidationSchema = Joi.object<IConfig>({
  APP_PORT: Joi.number().required().default(8000),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_NAME: Joi.string().required(),
  DB_AUTHSOURCE: Joi.string().required(),
  DB_USER: Joi.optional().default(''),
  DB_PASS: Joi.optional().default(''),

  BCRYPT_SALT_ROUNDS: Joi.number().required(),

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
});
