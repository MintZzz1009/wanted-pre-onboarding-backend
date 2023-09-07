// redis
const redis = require('redis');

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}`,
  password: process.env.REDIS_PASSWORD,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

module.exports = redisClient;
