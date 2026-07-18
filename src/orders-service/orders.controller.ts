import { Controller } from "@nestjs/common";
import { OrderService } from "./orders.services";
import { ORDERS_PATTERNS } from "src/common/message-patterns";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order-dto";
import { FindOrderQueryDto } from "./dto/find-order-query.dto";

@Controller()
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    @MessagePattern(ORDERS_PATTERNS.CREATE)
    create(@Payload() createOrderDto: CreateOrderDto) {
        return this.orderService.create(createOrderDto);
    }

    @MessagePattern(ORDERS_PATTERNS.FIND_ALL)
    findAll(
        @Payload() payload: { query: FindOrderQueryDto },
    ) {
        return this.orderService.findAll(payload.query);
    }

    @MessagePattern(ORDERS_PATTERNS.UPDATE)
    update(@Payload() payload: { id: number; dto: UpdateOrderDto }) {
        return this.orderService.update(payload.id, payload.dto);
    }

    @MessagePattern(ORDERS_PATTERNS.REMOVE)
    async remove(@Payload() payload: { id: number }) {
        await this.orderService.remove(payload.id);
        return null;
    }
}