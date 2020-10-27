import { Controller, Get, Post, ValidationPipe, UsePipes, Body, Put, Param, Delete } from '@nestjs/common';
import { PostService } from './post.service'
import {Post as PostType } from './post.model'
import { CreateOrupdatePostDto } from './dto/create-post-dto';

@Controller('post')
export class PostController {

  constructor(private postService: PostService) {}

  @Get()
  findAll(): Promise<PostType[]> {
    return this.postService.findAll()
  }

  @Get('/:id')
  findOneById(@Param('id') id: string): Promise<PostType> {
    return this.postService.findOneById(id)
  }

  @Post()
  @UsePipes(ValidationPipe)
  create(@Body() createPostDto: CreateOrupdatePostDto): Promise<PostType> {
    return this.postService.create(createPostDto)
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  updatePost(
    @Param('id') id: string,
    @Body() body : CreateOrupdatePostDto
  ): Promise<PostType> {
    return this.postService.updatePost(body, id)
  }

  @Delete('/:id')
  deletePost(@Param('id') id: string): Promise<void> {
    return this.postService.deletePost(id)
  }
}
