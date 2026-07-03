import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { callMicroservice } from '../../common/rpc-client.util';
import { EMPLOYEES_PATTERNS } from '../../common/message-patterns';

export interface EmployeeWithPassword {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

@Injectable()
export class EmployeesClientService {
  constructor(
    @Inject('EMPLOYEES_SERVICE') private readonly client: ClientProxy,
  ) {}

  findByEmail(email: string): Promise<EmployeeWithPassword | null> {
    return callMicroservice(
      this.client.send(EMPLOYEES_PATTERNS.FIND_BY_EMAIL, { email }),
    );
  }
}
