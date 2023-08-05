require('dotenv').config();
const env = process.env;

const development = {
  // username: env.MYSQL_AWS_USERNAME,
  // password: env.MYSQL_AWS_PASSWORD,
  // database: env.MYSQL_AWS_DATABASE,
  // host: env.MYSQL_AWS_HOST,
  username: env.LOCAL_DB_USERNAME,
  password: env.LOCAL_DB_PASSWORD,
  database: env.LOCAL_DB_DATABASE,
  host: env.LOCAL_DB_HOST,
  dialect: 'mysql',
  logging: false,
  timezone: '+09:00',
  dialectOptions: {
    charset: 'utf8mb4',
    dateStrings: true,
    typeCast: true,
  },
};
const test = {
  username: 'root',
  password: null,
  database: 'database_test',
  host: '127.0.0.1',
  dialect: 'mysql',
};
const production = {
  username: 'root',
  password: null,
  database: 'database_production',
  host: '127.0.0.1',
  dialect: 'mysql',
};

module.exports = { development, test, production };
