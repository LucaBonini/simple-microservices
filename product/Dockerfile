FROM node:12.19.0-alpine

WORKDIR /product

# Install some dependencies
COPY ./package.json ./
RUN npm install

COPY ./ ./

EXPOSE 3001

CMD ["npm", "start"]