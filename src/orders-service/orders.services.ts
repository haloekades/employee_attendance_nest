import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { In, Repository } from "typeorm";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order-dto";
import { FindOrderQueryDto } from "./dto/find-order-query.dto";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
    ) { }

    async create(createOrderDto: CreateOrderDto): Promise<Order> {
        const order = this.orderRepository.create({
            ...createOrderDto
        });
        return this.orderRepository.save(order);
    }

    findAll(
        query: FindOrderQueryDto,
    ): Promise<Order[]> {
        // return this.orderRepository.find();
        const { statuses } = query;
        const whereCondition: any = {};

        if (statuses && statuses.length > 0) {
            whereCondition.status = In(statuses);
        }

        return this.orderRepository.find({
            where: whereCondition,
            order: { 
                status: 'DESC',
                createdAt: 'DESC' 
            },
        });
    }

    async findOne(id: number): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { id },
        });
        if (!order) {
            throw new NotFoundException(`Order ${id} not found`);
        }
        return order;
    }

    async update(
        id: number,
        updateOrderDto: UpdateOrderDto,
    ): Promise<Order> {
        const order = await this.findOne(id);
        Object.assign(order, updateOrderDto);
        return this.orderRepository.save(order);
    }

    async remove(id: number): Promise<void> {
        const result = await this.orderRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Employee ${id} not found`);
        }
    }

}