import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { rmqOptions } from '../common/rmq-client-options';
import { RpcExceptionFilter } from '../common/rpc-exception.filter';
import { EmployeesModule } from './employees.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    EmployeesModule,
    rmqOptions(process.env.EMPLOYEES_QUEUE ?? 'employees_queue'),
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new RpcExceptionFilter());
  await app.listen();

  console.log('Employees microservice is listening');
}
void bootstrap();
