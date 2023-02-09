FROM node:18.14.0-alpine

RUN apk add --no-cache bash

RUN npm install -g rimraf

RUN npm install -g @nestjs/cli

USER node

WORKDIR /home/node/app