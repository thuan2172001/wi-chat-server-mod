FROM node:15.14-alpine3.10 AS builder

WORKDIR /app

RUN apk --no-cache add \
    g++ make python git \
    && rm -rf /var/cache/apk/*

COPY package.json yarn*.lock /app/

RUN yarn --pure-lockfile


# Runtime image from here
FROM node:15.14-alpine3.10

WORKDIR /app

RUN apk --no-cache add bash ghostscript graphicsmagick

RUN yarn global add pm2 nodemon

COPY ./.babelrc .

COPY --from=builder /app .

COPY ./app ./app

