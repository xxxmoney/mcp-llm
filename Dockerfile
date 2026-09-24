
FROM node:26-alpine AS build

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm clean-install

COPY . .

RUN npm run build

FROM node:26-alpine AS production

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm clean-install --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 666

CMD ["npm", "run", "start"]
