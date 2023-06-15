#!/bin/bash
FROM --platform=linux/amd64 node:18 as build

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD npm run build


FROM --platform=linux/amd64 node:18
WORKDIR /app
COPY package.json .
RUN npm install --only=production
COPY --from=build /app/dist ./dist
CMD npm run start:prod

