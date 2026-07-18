import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrdersController } from './order.controller';
import { OrderClientService } from './order-client.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'ORDERS_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [
              configService.get<string>(
                'RABBITMQ_URL',
                'amqp://guest:guest@localhost:5672',
              ),
            ],
            queue: configService.get<string>(
              'ORDERS_QUEUE',
              'orders_queue',
            ),
            queueOptions: { durable: true },
          },
        }),
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrderClientService],
})
export class OrdersModule {}
