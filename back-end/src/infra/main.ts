import { NestFactory } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { json, urlencoded } from 'express'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(json({ limit: '50mb' }))
  app.use(urlencoded({ extended: true, limit: '50mb' }))

  const envService = app.get(EnvService)

  const port = envService.get('PORT')

  app.connectMicroservice({
    name: 'QUEUE',
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@rabbitmq:5672'],
      queue: 'QUEUE',
      noAck: false,
      prefetchCount: 1,
      isGlobalPrefetchCount: true,
      queueOptions: {
        durable: true,
        deadLetterExchange: '',
        deadLetterRoutingKey: 'DEAD_QUEUE',
      },
    },
  })

  app.connectMicroservice({
    name: 'DEAD_QUEUE',
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@rabbitmq:5672'],
      queue: 'DEAD_QUEUE',
      noAck: false,
      prefetchCount: 1,
    },
  })

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document)

  await app.startAllMicroservices()

  app.setGlobalPrefix('integrations')

  await app.listen(port)
}
bootstrap()
