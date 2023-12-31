// modules
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// deploy
const helmet = require('helmet');
const hpp = require('hpp');

// .env
require('dotenv').config();

// router
const authRouter = require('./routes/auth.routes');
const postsRouter = require('./routes/posts.routes');
const ErrorHandler = require('./middleware/errorhandler');

const app = express();

// middlewares
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
app.use(ErrorHandler.handle);

module.exports = app;
