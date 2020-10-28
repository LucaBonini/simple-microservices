import { Controller, Get, Post, ValidationPipe, UsePipes, Body, Put, Param, Delete } from '@nestjs/common';
import { PostService } from './post.service'
import {Post as PostType } from './post.model'
import { CreatePostDto, UpdatePostDto } from './dto/post-dto';

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
  create(@Body() createPostDto: CreatePostDto): Promise<PostType> {
    return this.postService.create(createPostDto)
  }

  @Put('/:id')
  @UsePipes(ValidationPipe)
  updatePost(
    @Param('id') id: string,
    @Body() body : UpdatePostDto
  ): Promise<PostType> {
    return this.postService.updatePost(body, id)
  }

  @Delete('/:id')
  deletePost(@Param('id') id: string): Promise<boolean> {
    return this.postService.deletePost(id)
  }
}
