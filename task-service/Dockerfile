FROM node:18-alpine
RUN apk add --no-cache wget
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4002
CMD [ "node", "src/server.js" ]