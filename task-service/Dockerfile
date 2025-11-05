FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY . .
EXPOSE 4002
CMD [ "node", "src/server.js" ]