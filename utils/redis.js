// redis
const redis = require('redis');
const { REDIS_HOST, REDIS_PASSWORD } = process.env;

const redisClient = redis.createClient({
  url: `redis://${REDIS_HOST}`,
  password: REDIS_PASSWORD,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

module.exports = redisClient;
