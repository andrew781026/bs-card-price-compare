### WARNING: This file is generated from template, edit the file under build-resources/template ###

FROM node:14-alpine

# Create app directory
WORKDIR /home/node

# 複製 package.json 到 docker 內的 WORKDIR
COPY linebot/package.json .

RUN npm install

# 複製 src 底下的程式碼
COPY linebot .

CMD npm run tsc-start

LABEL name=bs-linebot
LABEL group=andrew
LABEL version=0.0.1
