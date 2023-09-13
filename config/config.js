require('dotenv').config();
const env = process.env;

const development = {
  username: env.LOCAL_DB_USERNAME,
  password: env.LOCAL_DB_PASSWORD,
  database: env.LOCAL_DB_DATABASE,
  host: env.LOCAL_DB_HOST,
  // username: env.AWS_DB_USERNAME,
  // password: env.AWS_DB_PASSWORD,
  // database: env.AWS_DB_DATABASE,
  // host: env.AWS_DB_HOST,
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
  password: env.LOCAL_DB_PASSWORD,
  database: 'wanted_test',
  host: '127.0.0.1',
  dialect: 'mysql',
};
const production = {
  username: env.AWS_DB_USERNAME,
  password: env.AWS_DB_PASSWORD,
  database: env.AWS_DB_DATABASE,
  host: env.AWS_DB_HOST,
  dialect: 'mysql',
};

module.exports = { development, test, production };

// npm sequelize db table cloumm --
// npx sequelize db:create --env test
