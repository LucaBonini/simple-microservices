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

Category 
- Get all the categories `[GET] http://localhost:3003/category`
- Get a category by id `[GET] http://localhost:3003/category/:id`
- Create a new category `[POST] http://localhost:3003/category`
- Edit a category `[PATCH] http://localhost:3003/category/:id/name`
- Delete a category `[DELETE] http://localhost:3003/category/:id`

Post
- Get all the posts `[GET] http://localhost:3003/post`
- Get a post by id `[GET] http://localhost:3003/post/:id`
- Create a new post `[POST] http://localhost:3003/post`
- Edit a posy `[PUT] http://localhost:3003/put/:id`
- Delete a post `[DELETE] http://localhost:3003/post/:id`

Product
- Get all the products `[GET] http://localhost:3003/product`
- Get a product by id `[GET] http://localhost:3003/product/:id`
- Create a new product `[POST] http://localhost:3003/product`
- Edit a posy `[PUT] http://localhost:3003/put/:id`
- Delete a product `[DELETE] http://localhost:3003/product/:id`


### Note
if you use Postman to make requests then the body has to be `x-www-urlencoded`