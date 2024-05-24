import { BrokerRepository } from '@/domain/application/broker/broker-repository'
import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { MailModule } from '../mail/mail.module'
import { RabbitmqRepository } from './rabbitmq-repository'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'QUEUE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@rabbitmq:5672'],
          queue: 'QUEUE',
          prefetchCount: 1,
          isGlobalPrefetchCount: true,
          socketOptions: {
            reconnectTimeInSeconds: 2,
          },
          queueOptions: {
            deadLetterExchange: '',
            deadLetterRoutingKey: 'DEAD_QUEUE',
            durable: true,
          },
        },
      },
      {
        name: 'DEAD_QUEUE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@rabbitmq:5672'],
          queue: 'DEAD_QUEUE',
        },
      },
    ]),
    MailModule,
  ],
  providers: [
    {
      provide: BrokerRepository,
      useClass: RabbitmqRepository,
    },
  ],
  exports: [BrokerRepository],
})
export class BrokerModule {}
