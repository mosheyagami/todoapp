# STAGE 1: BUILD
FROM node:20.11.0-slim AS build

RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

#STAGE 2: RUN
FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /usr/src/app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]