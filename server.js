const linkToDatabase = require('./db');
const app = require('./app');
const ErrorHandler = require('./middleware/errorhandler');

ErrorHandler.initializeUnhandledException();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`✅ 서버가 http://localhost:${port}/ 에서 활성화되었습니다.`);
});
