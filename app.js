const express = require('express');

require('dotenv').config();

const app = express();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`✅ 서버가 ${port}번 포트에서 활성화되었습니다.`);
});
