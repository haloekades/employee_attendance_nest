import { NestFactory } from "@nestjs/core";
import { OrdersModule } from "./orders.module";
import { rmqOptions } from "src/common/rmq-client-options";
import { ValidationPipe } from "@nestjs/common";
import { RpcExceptionFilter } from "src/common/rpc-exception.filter";

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    OrdersModule,
    rmqOptions(process.env.ORDERS_QUEUE ?? 'orders_queue'),
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new RpcExceptionFilter());
  await app.listen();

  console.log('Order microservice is listening');
}
void bootstrap();
