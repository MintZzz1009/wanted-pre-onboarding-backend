const app = require('./app');

app.listen(port, () => {
  console.log(`✅ 서버가 http://localhost:${port}/ 에서 활성화되었습니다.`);
});