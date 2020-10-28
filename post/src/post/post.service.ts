import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as lowdb from 'lowdb';
import * as FileAsync from 'lowdb/adapters/FileAsync';
import { v4 as uuidv4 } from 'uuid';
import { Post } from '../post/post.model'
import { CreatePostDto, UpdatePostDto } from './dto/post-dto';
import { ClientOptions, ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices'

const microservicesOptions: ClientOptions = {
  transport: Transport.REDIS,
  options: {
    url: 'redis://localhost:1111'
  }
}

@Injectable()
export class PostService {
  private db: lowdb.LowdbAsync<any>
  private client: ClientProxy

  constructor() {
    this.initDb()
    this.client = ClientProxyFactory.create(microservicesOptions)
  }

  async initDb(): Promise<void> {
    const adapter = new FileAsync('db.json')
    this.db = await lowdb(adapter)
    
    const postData = await this.db.get('post').value()

    if (!postData) {
      await this.db.set('post',[]).write()
    }
  }

  async findAll(): Promise<Post[]> {
    const posts: Post[] = await this.db.get('post').value()
    return posts
  }

  async findOneById(id: string): Promise<Post> {
    const posts: Post[] = await this.db.get('post').value()

    let foundPost = posts.find(obj => obj.id === id)
    if (!foundPost) {
      throw new HttpException(`No post with id ${id} found`, HttpStatus.BAD_REQUEST)
    }
    return foundPost
  }

  async create(post: CreatePostDto): Promise<Post> {
    const data = this.db.get('post').value()

    const { title, body, category } = post

    let newPost: Post = {
      id: uuidv4(),
      title,
      body,
      category
    }

    data.push(newPost)

    await this.db.set('post', data).write()

    this.client.send<void, Post>(
      'post_added',
      newPost
    ).toPromise()

    return newPost
  }

  // check later maybe is not good CreatePostDto
  async updatePost(update: UpdatePostDto, id: string): Promise<Post> {
    let posts: Post[] = this.db.get('post').value()
    const foundPost = posts.find(post => post.id === id)
    if (!foundPost) {
      throw new HttpException(`No post with id ${id} found`, HttpStatus.BAD_REQUEST)
    }

    if (update.category) {
      const categoryExist = await this.client.send<boolean, string>(
        'category_exists',
        update.category
      ).toPromise()

      if (!categoryExist) {
        throw new HttpException(`No product with category id ${update.category} found`, HttpStatus.BAD_REQUEST)
      }
    }

    const newPost: Post = {
      ...foundPost,
      ...update
    }

    posts = posts.map(post => {
      return (post.id === newPost.id) ? newPost : post
    })

    await this.db.set('post', posts).write()

    return newPost
  }

  async deletePost(id: string): Promise<void> {
    let posts: Post[] = await this.db.get('post').value()
    const postFound = posts.find(post => post.id === id)
    if (!postFound) {
      throw new HttpException('No post found', HttpStatus.BAD_REQUEST)
    }

    posts = posts.filter(post => post.id !== postFound.id)

    await this.db.set('category', posts).write()
    
    await this.client.send<void, Post>(
      'post_removed',
      postFound
    ).toPromise()
  }
}
