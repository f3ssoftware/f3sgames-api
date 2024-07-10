FROM node:16-alpine

# Instalar dependências de construção
RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

COPY package*.json ./

# Instalar dependências, incluindo bcryptjs
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:dev"]
