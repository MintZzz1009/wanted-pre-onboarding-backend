require('dotenv').config();
const {
  LOCAL_DB_PASSWORD,
  LOCAL_DB_USERNAME,
  LOCAL_DB_DATABASE,
  LOCAL_DB_HOST,
  AWS_DB_USERNAME,
  AWS_DB_PASSWORD,
  AWS_DB_HOST,
  AWS_DB_DATABASE,
} = process.env;

const development = {
  username: LOCAL_DB_USERNAME,
  password: LOCAL_DB_PASSWORD,
  database: LOCAL_DB_DATABASE,
  host: LOCAL_DB_HOST,
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
  password: LOCAL_DB_PASSWORD,
  database: 'wanted_test',
  host: '127.0.0.1',
  dialect: 'mysql',
};
const production = {
  username: AWS_DB_USERNAME,
  password: AWS_DB_PASSWORD,
  database: AWS_DB_DATABASE,
  host: AWS_DB_HOST,
  dialect: 'mysql',
  timezone: '+09:00',
  dialectOptions: {
    charset: 'utf8mb4',
    dateStrings: true,
    typeCast: true,
  },
};

module.exports = { development, test, production };
