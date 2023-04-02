export interface IConfig {
  APP_PORT: number;

  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_AUTHSOURCE: string;
  DB_USER: string;
  DB_PASS: string;

  JWT_SECRET: string;
}
