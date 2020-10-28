FROM node:12.19.0-alpine

WORKDIR /category

# Install some dependencies
COPY ./package.json ./
RUN npm install

COPY ./ ./

EXPOSE 3003

CMD ["npm", "start"]