echo "wait db server"
dockerize -wait tcp://db:3306 -timeout 5s

# echo "initiallize db"
# npx sequelize db:create --env production 
# npx sequelize db:migrate --env production 

echo "start node server"
# node server.js                    # development

# Error - haksoo/wanted-server:0.1.0 - cross-env: not found
# cross-env NODE_ENV=production pm2 start server.js     # production

# Error - haksoo/wanted-server:0.2.0 - pm2: not found
# NODE_ENV=production pm2 start server.js     # production
# npx NODE_ENV=production pm2 start server.js   
# -> npm ERR! Invalid tag name "NODE_ENV=production" of package "NODE_ENV=production": Tags may not have any characters that encodeURIComponent encodes.

# Error - haksoo/wanted-server:0.3.0 - 실행은 되는데, container가 바로 종료됨
# npm start     # product ion

# Success - haksoo/wanted-server:0.4.0
# NODE_ENV=production node server     # production

#  - haksoo/wanted-server:0.5.0 - package.json/npm start: -i 0 옵션 삭제
npm run dev
# NODE_ENV=production node server