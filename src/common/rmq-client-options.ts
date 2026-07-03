import { RmqOptions, Transport } from '@nestjs/microservices';

export function rmqOptions(queue: string): RmqOptions {
  return {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672'],
      queue,
      queueOptions: { durable: true },
    },
  };
}
