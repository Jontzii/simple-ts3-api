FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install pm2 -g
RUN npm install typescript -g

COPY . .

RUN npm run build

CMD [ "pm2-runtime", "production.config.js" ]