import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EmployeesClientService } from './employees-client.service';
import { EmployeesController } from './employees.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'EMPLOYEES_SERVICE',
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
              'EMPLOYEES_QUEUE',
              'employees_queue',
            ),
            queueOptions: { durable: true },
          },
        }),
      },
    ]),
  ],
  controllers: [EmployeesController],
  providers: [EmployeesClientService],
})
export class EmployeesModule {}
