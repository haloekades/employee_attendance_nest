import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { OrderClientService } from './order-client.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order-dto';
import { FindOrderQueryDto } from './dto/find-order-query.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderClient: OrderClientService) { }

  @Post()
  create(@Body() createEmployeeDto: CreateOrderDto) {
    return this.orderClient.create(createEmployeeDto);
  }

  @Get()
  findAll(
    @Query() query: FindOrderQueryDto,
  ) {
    return this.orderClient.findAll(query);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderClient.update(id, updateOrderDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.orderClient.remove(id);
  }
}
