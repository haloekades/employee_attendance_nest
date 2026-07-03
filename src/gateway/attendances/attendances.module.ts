import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AttendancesClientService } from './attendances-client.service';
import { AttendancesController } from './attendances.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'ATTENDANCES_SERVICE',
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
              'ATTENDANCES_QUEUE',
              'attendances_queue',
            ),
            queueOptions: { durable: true },
          },
        }),
      },
    ]),
  ],
  controllers: [AttendancesController],
  providers: [AttendancesClientService],
})
export class AttendancesModule {}
