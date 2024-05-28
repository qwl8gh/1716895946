FROM node:latest
WORKDIR /app/backend
COPY ../.env ./
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE ${VUE_APP_SERVER_PORT}
CMD ["npm", "run", "start"]