FROM node:19

WORKDIR /earth

COPY package.json ./

RUN npm install

COPY . .

CMD ["node", "index.js"]