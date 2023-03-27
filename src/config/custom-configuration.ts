/* eslint-disable @typescript-eslint/no-non-null-assertion */
export default () => ({
  port: parseInt(process.env.APP_PORT!, 10) || 3000,
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!, 10) || 27017,
  },
});
