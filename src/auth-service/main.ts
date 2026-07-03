import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { rmqOptions } from '../common/rmq-client-options';
import { RpcExceptionFilter } from '../common/rpc-exception.filter';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AuthModule,
    rmqOptions(process.env.AUTH_QUEUE ?? 'auth_queue'),
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new RpcExceptionFilter());
  await app.listen();

  console.log('Auth microservice is listening');
}
void bootstrap();
