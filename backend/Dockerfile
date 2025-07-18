FROM node:18-alpine
WORKDIR /assingment
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm","run","dev"]
