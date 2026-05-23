# backend/Dockerfile
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Alerta de Prova/Prática: Como usamos o Prisma, precisamos gerar o Client 
# dentro do container para que as tipagens do banco funcionem perfeitamente
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "start:dev"]