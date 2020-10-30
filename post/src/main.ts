import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Transport, MicroserviceOptions } from '@nestjs/microservices'

async function bootstrap () {
  const app = await NestFactory.create(AppModule)
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      url: `redis://${process.env.DOCKER == 'true' ? 'redis' : 'localhost'}:6379`
    }
  })
  await app.startAllMicroservicesAsync()
  await app.listen(3002)
}
bootstrap()
