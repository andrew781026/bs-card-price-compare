FROM node:14-alpine

WORKDIR /app

# 複製 package.json 檔案到 docker 內部根資料夾
COPY package.json .

RUN npm install

# 複製目前資料夾到 docker 內部根資料夾
COPY . .

EXPOSE 8080

CMD [ "node", "app.js" ]
