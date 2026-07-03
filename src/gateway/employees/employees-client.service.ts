import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EMPLOYEES_PATTERNS } from '../../common/message-patterns';
import { sendRpc } from '../../common/rpc-to-http.util';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesClientService {
  constructor(
    @Inject('EMPLOYEES_SERVICE') private readonly client: ClientProxy,
  ) {}

  create(createEmployeeDto: CreateEmployeeDto) {
    return sendRpc(
      this.client.send(EMPLOYEES_PATTERNS.CREATE, createEmployeeDto),
    );
  }

  findAll() {
    return sendRpc(this.client.send(EMPLOYEES_PATTERNS.FIND_ALL, {}));
  }

  findOne(id: number) {
    return sendRpc(this.client.send(EMPLOYEES_PATTERNS.FIND_ONE, { id }));
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    return sendRpc(
      this.client.send(EMPLOYEES_PATTERNS.UPDATE, {
        id,
        dto: updateEmployeeDto,
      }),
    );
  }

  remove(id: number) {
    return sendRpc(this.client.send(EMPLOYEES_PATTERNS.REMOVE, { id }));
  }
}
