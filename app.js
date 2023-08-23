const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const authRouter = require('./routes/auth.routes');
const postsRouter = require('./routes/posts.routes');

const app = express();

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 3000;

app.use('/auth', authRouter);
app.use('/posts', postsRouter);

module.exports = app;
