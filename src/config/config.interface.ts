export interface IConfig {
  APP_PORT: number;

  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_AUTHSOURCE: string;
  DB_USER: string;
  DB_PASS: string;

  BCRYPT_SALT_ROUNDS: number;

  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;

  AUTH_COOKIE_NAME: string;
}
