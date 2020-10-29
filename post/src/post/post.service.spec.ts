import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../database/database.service';
import { CreatePostDto, UpdatePostDto } from './dto/post-dto';
import { Post } from './post.model';
import { PostService } from './post.service';

const mockDatabaseService = () => ({
  findAll: jest.fn(),
  findOneById: jest.fn(),
  create: jest.fn(),
  deleteCategory: jest.fn(),
  deleteOne: jest.fn(),
  updateOne: jest.fn()
})

describe('PostService', () => {
  let postService: PostService
  let databaseService
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {provide: DatabaseService, useFactory: mockDatabaseService}
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
    databaseService = module.get<DatabaseService>(DatabaseService)
  });

  describe('findAll', () => {
    it('Gets all the posts', async () => {
      databaseService.findAll.mockResolvedValue('value')
      const result = await postService.findAll()
      expect(databaseService.findAll).toHaveBeenCalled()
      expect(result).toEqual('value')
    })
  })

  describe('findOneById', () => {
    it('Gets the post by id', async () => {
      const mockPost: Post = {
        id: 'qwerty',
        title: 'category name',
        body: 'body',
        category: '123456'
      }
      databaseService.findOneById.mockResolvedValue(mockPost)

      const result = await postService.findOneById('qwerty')
      expect(result).toEqual(mockPost)
    })

    it('Thorws an error if post id is not found', () => {
      databaseService.findOneById.mockResolvedValue(undefined)
      expect(postService.findOneById('12345')).rejects.toThrow()
    })
  })

  describe('create', () => {
    it('calls databaseService.create() and return the result', async () => {
      expect(databaseService.create).not.toHaveBeenCalled()

      const mockCreatedPost: Post = {id:'asdfg', title: 'new post', body: 'body', category: '123456'}
      databaseService.create.mockResolvedValue(mockCreatedPost)
      
      const mockCreatePostDto: CreatePostDto = { title: 'new post', body: 'body', category: '123456'}
      const result =  await postService.create(mockCreatePostDto)

      expect(result).toEqual(expect.objectContaining({
        id: expect.any(String),
        title: 'new post',
        body: 'body',
        category: '123456'
      }))
    })
  })

  describe('deleteOne', () => { 
    it('delete the post', async () => {
      expect(databaseService.deleteOne).not.toHaveBeenCalled()

      const mockFoundPost: Post = { id: 'qwerty', title: 'title', body: 'body', category: '123456'}
      databaseService.findOneById.mockResolvedValue(mockFoundPost)
      databaseService.deleteOne.mockResolvedValue(true)

      const result = await postService.deletePost('qwerty')
      expect(result).toEqual(true)
    })

    it('throws an error if post is not found', () => {
      expect(databaseService.deleteOne).not.toHaveBeenCalled()

      databaseService.findOneById.mockResolvedValue(undefined)

      expect(postService.deletePost('qwerty')).rejects.toThrow()
    })
  })

  describe('updatePost', () => {
    it('updates the post', async () => {
      expect(databaseService.updateOne).not.toHaveBeenCalled()

      const mockFoundPost: Post  = { id: 'qwerty', title: 'title', body: 'body', category: '123456'}
      const mockUpdatePostDto: UpdatePostDto = { title: 'title', body: 'new body', category: '123456'}
      databaseService.updateOne.mockResolvedValue({
        ...mockFoundPost,
        ...mockUpdatePostDto
      })

      postService.client.send = jest.fn().mockReturnValue({
        toPromise: () => true
      })

      const result = await postService.updatePost(mockUpdatePostDto, '123456')
      expect(result).toEqual(expect.objectContaining({
        id: mockFoundPost.id,
        title: 'title',
        body: 'new body',
        category: mockFoundPost.category
      }))
    })

    it('should throw an error if the category is not found', () => {
      expect(databaseService.updateOne).not.toHaveBeenCalled()
      const mockUpdatePostDto: UpdatePostDto = { title: 'title', body: 'new body', category: '123456'}
      databaseService.updateOne.mockResolvedValue(undefined)

      expect(postService.updatePost(mockUpdatePostDto, '123456')).rejects
    })
  })

  describe('deletePost', () => {
    it('should delet a post', async () => {
      expect(databaseService.deleteOne).not.toHaveBeenCalled()
      const mockFoundPost: Post  = { id: 'qwerty', title: 'title', body: 'body', category: '123456'}

      databaseService.findOneById.mockResolvedValue(mockFoundPost)
      databaseService.deleteOne.mockResolvedValue(true)

      postService.client.send = jest.fn().mockReturnValue({
        toPromise: () => true
      })
      const result = await postService.deletePost('qwerty')
      expect(result).toEqual(true)
    })

    it('should throw en arror if the post is not found', () => {
      expect(databaseService.deleteOne).not.toHaveBeenCalled()

      databaseService.findOneById.mockResolvedValue(undefined)

      expect(postService.deletePost('qwerty')).rejects.toThrow()
    })
  })

});
