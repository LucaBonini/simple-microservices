import { Injectable, NotFoundException } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'
import { Post } from '../post/post.model'
import { CreatePostDto, UpdatePostDto } from './dto/post-dto'
import { ClientOptions, ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices'
import { DatabaseService } from '../database/database.service'

const microservicesOptions: ClientOptions = {
  transport: Transport.REDIS,
  options: {
    url: `redis://${process.env.DOCKER == 'true' ? 'redis' : 'localhost'}:6379`
  }
}

@Injectable()
export class PostService {
  // I set it public to easy test it in the test suite
  public client: ClientProxy

  constructor (private readonly db: DatabaseService) {
    this.client = ClientProxyFactory.create(microservicesOptions)
  }

  async findAll (): Promise<Post[]> {
    return await this.db.findAll<Post>()
  }

  async findOneById (id: string): Promise<Post> {
    const postFound = await this.db.findOneById<Post>(id)
    if (!postFound) {
      throw new NotFoundException(`No post with id ${id} found`)
    }

    return postFound
  }

  async create (post: CreatePostDto): Promise<Post> {
    const { title, body, category } = post

    const newPost: Post = {
      id: uuidv4(),
      title,
      body,
      category
    }

    const res = await this.db.create<Post>(newPost)

    this.client.send<void, Post>(
      'post_added',
      newPost
    ).toPromise()

    return res
  }

  async updatePost (update: UpdatePostDto, id: string): Promise<Post> {
    if (update.category) {
      // I miss to handle the case of changing category
      // when update.category !== originalPost.category
      // need to send a message to category and increase or decrease postCount
      const categoryExist = await this.client.send<boolean, string>(
        'category_exists',
        update.category
      ).toPromise()

      if (!categoryExist) {
        throw new NotFoundException(`No product with category id ${update.category} found`)
      }
    }

    const updatedPost = await this.db.updateOne<Post>(id, update)
    if (!updatedPost) {
      throw new NotFoundException(`No post with id ${id} found`)
    }

    return updatedPost
  }

  async deletePost (id: string): Promise<boolean> {
    const post = await this.db.findOneById<Post>(id)

    const res = await this.db.deleteOne<Post>(id)
    if (!res) {
      throw new NotFoundException(`No post with id ${id} found`)
    }

    this.client.send<void, Post>(
      'post_removed',
      post
    ).toPromise()

    return res
  }
}
