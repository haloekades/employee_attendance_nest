import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderController } from './orders.controller';
import { OrderService } from './orders.services';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME', 'attendance'),
        entities: [Order],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
      }),
    }),
    TypeOrmModule.forFeature([Order]),
    // ClientsModule.registerAsync([
    //   {
    //     name: 'EMPLOYEES_SERVICE',
    //     imports: [ConfigModule],
    //     inject: [ConfigService],
    //     useFactory: (configService: ConfigService) => ({
    //       transport: Transport.RMQ,
    //       options: {
    //         urls: [
    //           configService.get<string>(
    //             'RABBITMQ_URL',
    //             'amqp://guest:guest@localhost:5672',
    //           ),
    //         ],
    //         queue: configService.get<string>(
    //           'EMPLOYEES_QUEUE',
    //           'employees_queue',
    //         ),
    //         queueOptions: { durable: true },
    //       },
    //     }),
    //   },
    // ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrdersModule {}
