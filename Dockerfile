
FROM node:26-alpine as development

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm clean-install

COPY . .

EXPOSE 666

CMD ["npm", "run", "dev"]

# TODO: specify production and use in prod docker dompose
