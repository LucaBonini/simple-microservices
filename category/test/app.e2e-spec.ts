import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
// import { AppModule } from './../src/app.module';
import { CategoryModule } from '../src/category/category.module'
import { DatabaseService } from '../src/database/database.service'

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CategoryModule],
      providers: [DatabaseService]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/category')
      .expect(200)
  })
})
