FROM node

WORKDIR /node-app

COPY package*.json .

RUN npm install

COPY . . 

EXPOSE 50051

CMD node app.js