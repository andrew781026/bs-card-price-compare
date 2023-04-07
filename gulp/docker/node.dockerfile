### WARNING: This file is generated from template, edit the file under build-resources/template ###

FROM node:14-alpine

# Create app directory
WORKDIR /home/node

COPY package.json .

RUN npm install

COPY . .

CMD [ "node", "auth-app.js" ]

LABEL name=bs-linebot
LABEL group=andrew
LABEL version=0.0.1
