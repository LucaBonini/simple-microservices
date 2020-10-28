FROM node:12.19.0-alpine

WORKDIR /post

# Install some dependencies
COPY ./package.json ./
RUN npm install

COPY ./ ./

EXPOSE 3002

CMD ["npm", "start"]