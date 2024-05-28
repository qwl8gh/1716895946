FROM node:latest
WORKDIR /app/frontend
COPY ../.env ./
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE ${VUE_APP_CLIENT_PORT}
CMD ["npm", "run", "serve"]
