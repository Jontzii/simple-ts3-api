FROM mhart/alpine-node:14.15.4 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install typescript -g
COPY . .
RUN npm run build

FROM mhart/alpine-node:14.15.4
WORKDIR /app
ENV NODE_ENV=production
RUN npm install express
RUN npm install ts3-nodejs-library
RUN npm install dotenv
COPY --from=builder /usr/src/app/build .
CMD [ "node", "./index.js" ]