FROM node:7-alpine

WORKDIR /usr/src

COPY package.json /usr/src/
RUN npm install

COPY . /usr/src/

EXPOSE 3000
CMD [ "npm", "start" ]
