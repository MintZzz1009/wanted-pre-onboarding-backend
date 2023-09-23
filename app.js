const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./models');

// deploy
const helmet = require('helmet');
const hpp = require('hpp');

require('dotenv').config();

const authRouter = require('./routes/auth.routes');
const postsRouter = require('./routes/posts.routes');

const app = express();

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
  })
  .catch((err) => {
    console.error(err);
  });

if (process.env.NODE_ENV === 'production') {
  // 배포용
  app.use(hpp());
  app.use(morgan('combined'));
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crissOriginResourcePolicy: false,
    })
  );
} else {
  // 개발용
  app.use(morgan('dev'));
}

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRouter);
app.use('/posts', postsRouter);
app.get('/', (req, res, next) => {
  res.send('Hello Wanted-pre-onboarding-internship');
});

module.exports = app;
