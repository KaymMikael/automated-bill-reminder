export default () => ({
  database: {
    type: process.env.APP_DB_TYPE,
    host: process.env.APP_DB_HOST,
    port: parseInt(process.env.APP_DB_PORT ?? '5432', 10),
    username: process.env.APP_DB_USERNAME,
    password: process.env.APP_DB_PASSWORD,
    database: process.env.APP_DB_NAME,
    autoLoadModels: true,
    synchronize: true, // should not be used in prod might lose prod data
  },
  jwt: {
    secret: process.env.APP_JWT_SECRET,
  },
});
