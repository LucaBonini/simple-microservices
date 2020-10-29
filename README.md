# Simple microservices

Simple microservices oriented backend, which exposes a web API that allows to manage some simple entities.

Written in Typescript using [NestJs](https://nestjs.com/), [lowDb](https://github.com/typicode/lowdb) as database and [Redis](https://redis.io/) as message broker

### Requirements:
  - [Docker](https://www.docker.com/), [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/)

### How to run it

- clone the project

- Open a terminal window in the root folder
  `docker-compose up`

  It will build the images and run them

### How to access the services

- Category 
  `http://localhost:3003/category`

- Post
  `http://localhost:3002/post`

- Product
  `http://localhost:3001/product`


### Note
if you use Postman to make requests then the body has to be `x-www-urlencoded`