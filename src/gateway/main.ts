import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { rmqOptions } from '../common/rmq-client-options';
import { AppModule } from './app.module';
import { RpcExceptionFilter } from 'src/common/rpc-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Hybrid app: HTTP for the REST API, plus an RMQ microservice connection
  // so NotificationsController can consume employee.updated events and
  // relay them over the notifications WebSocket namespace.
  app.connectMicroservice(
    rmqOptions(process.env.NOTIFICATIONS_QUEUE ?? 'notifications_queue'),
  );

  app.connectMicroservice(
    rmqOptions(process.env.AUTH_QUEUE ?? 'auth_queue'),
  );

  app.connectMicroservice(
    rmqOptions(process.env.EMPLOYEES_QUEUE ?? 'employees_queue'),
  );

  app.connectMicroservice(
    rmqOptions(process.env.ATTENDANCES_QUEUE ?? 'attendances_queue'),
  );

  app.useGlobalFilters(new RpcExceptionFilter());

  await app.startAllMicroservices();

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
