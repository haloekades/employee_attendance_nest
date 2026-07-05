import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { rmqOptions } from '../common/rmq-client-options';
import { AppModule } from './app.module';
import { AuthModule } from 'src/auth-service/auth.module';
import { RpcExceptionFilter } from 'src/common/rpc-exception.filter';
import { EmployeesModule } from 'src/employees-service/employees.module';
import { AttendancesModule } from './attendances/attendances.module';

async function bootstrapEmployee() {
  const app = await NestFactory.createMicroservice(
    EmployeesModule,
    rmqOptions(process.env.EMPLOYEES_QUEUE ?? 'employees_queue'),
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new RpcExceptionFilter());
  await app.listen();

  console.log('Employees microservice is listening');
}

async function bootstrapAttendance() {
  const app = await NestFactory.createMicroservice(
    AttendancesModule,
    rmqOptions(process.env.ATTENDANCES_QUEUE ?? 'attendances_queue'),
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new RpcExceptionFilter());
  await app.listen();

  console.log('Attendances microservice is listening');
}

async function bootstrapAuth() {
  const app = await NestFactory.createMicroservice(
    AuthModule,
    rmqOptions(process.env.AUTH_QUEUE ?? 'auth_queue'),
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new RpcExceptionFilter());
  await app.listen();

  console.log('Auth microservice is listening');
}

async function bootstrap() {
  bootstrapEmployee();
  bootstrapAttendance();
  bootstrapAuth();

  const app = await NestFactory.create(AppModule);
  app.enableCors();
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
