import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ORDERS_PATTERNS } from '../../common/message-patterns';
import { sendRpc } from '../../common/rpc-to-http.util';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order-dto';
import { FindOrderQueryDto } from './dto/find-order-query.dto';

@Injectable()
export class OrderClientService {
  constructor(
    @Inject('ORDERS_SERVICE') private readonly client: ClientProxy,
  ) {}

  create(createOrderDto: CreateOrderDto) {
    return sendRpc(
      this.client.send(ORDERS_PATTERNS.CREATE, createOrderDto),
    );
  }

  findAll(
    query: FindOrderQueryDto
  ) {
    return sendRpc(this.client.send(ORDERS_PATTERNS.FIND_ALL, {query}));
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return sendRpc(
      this.client.send(ORDERS_PATTERNS.UPDATE, {
        id,
        dto: updateOrderDto,
      }),
    );
  }

  remove(id: number) {
    return sendRpc(this.client.send(ORDERS_PATTERNS.REMOVE, { id }));
  }
}
