import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { rmqOptions } from '../common/rmq-client-options';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Hybrid app: HTTP for the REST API, plus an RMQ microservice connection
  // so NotificationsController can consume employee.updated events and
  // relay them over the notifications WebSocket namespace.
  app.connectMicroservice(
    rmqOptions(process.env.NOTIFICATIONS_QUEUE ?? 'notifications_queue'),
  );
  await app.startAllMicroservices();

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
