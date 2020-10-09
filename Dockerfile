FROM node:12
WORKDIR /usr/src/clean-appling
COPY ./package.json ./
RUN npm install --only=prod