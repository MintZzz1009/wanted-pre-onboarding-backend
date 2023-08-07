const express = require('express');
const morgan = require('morgan');

require('dotenv').config();

const authRouter = require('./routes/auth.routes');
const postsRouter = require('./routes/posts.routes');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 3000;

app.use('/auth', authRouter);
app.use('/posts', postsRouter);

app.listen(port, () => {
  console.log(`✅ 서버가 ${port}번 포트에서 활성화되었습니다.`);
});
