FROM node:20-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

FROM base AS dev

CMD ["npm", "run", "dev"]

FROM base AS prod

RUN npm run build

CMD ["npm", "start"]
