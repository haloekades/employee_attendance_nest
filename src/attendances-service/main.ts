import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { rmqOptions } from '../common/rmq-client-options';
import { RpcExceptionFilter } from '../common/rpc-exception.filter';
import { AttendancesModule } from './attendances.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    AttendancesModule,
    rmqOptions(process.env.ATTENDANCES_QUEUE ?? 'attendances_queue'),
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new RpcExceptionFilter());
  await app.listen();

  console.log('Attendances microservice is listening');
}
void bootstrap();
