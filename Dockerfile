FROM node:10-alpine as node

WORKDIR /*

COPY package*.json /*

RUN npm install

COPY ./ /*

ARG TARGET=ng-deploy

RUN npm run ${TARGET}


FROM nginx:1.13

COPY --from=node /* /usr/share/nginx/html

COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf
EXPOSE 80