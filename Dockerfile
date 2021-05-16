FROM node:15 AS builder
WORKDIR /home/node/app
COPY ./package.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:15-alpine
WORKDIR /home/node/app
COPY --from=builder /home/node/app ./
COPY package*.json ./

RUN npm install --only=production

EXPOSE 3000

CMD ["node", "dist/main"]
