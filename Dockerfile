FROM    ubuntu:jammy-20230816

RUN     apt-get update && apt-get install -y nodejs npm

# 2. Nodejs 패키지 설치
WORKDIR /usr/src/app
COPY    ./package*.json .
RUN     npm install

# 3. 소스 복사
COPY    . /usr/src/app

# 4. WEB 서버 실행 (Listen 포트 정의)
EXPOSE 8080
CMD    npm start
