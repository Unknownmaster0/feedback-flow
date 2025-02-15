FROM node:21-alpine

WORKDIR /nextapp

COPY package*.json yarn.lock ./

RUN yarn install

COPY . .

# RUN yarn build

EXPOSE 3000

CMD ["yarn", "dev"]