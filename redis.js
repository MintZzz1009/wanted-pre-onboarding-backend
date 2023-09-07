// const session = require('express-session');

// redis
const redis = require('redis');
// const RedisStore = require('connect-redis')(session);

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}`,
  password: process.env.REDIS_PASSWORD,
  legacyMode: true,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
// redisClient.connect()
// await client.set('key', 'value');
// const value = await client.get('key');
// await client.disconnect();

// app.use(
//   session({
//     resave: false,
//     saveUninitialized: false,
//     secret: process.env.COOKIE_SECRET,
//     cookie: {
//       httpOnly: true,
//       secure: false,
//     },
//     store: new RedisStore({ client: redisClient }),
//   })
// );

module.exports = redisClient;
