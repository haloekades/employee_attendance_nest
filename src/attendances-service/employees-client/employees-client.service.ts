import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { callMicroservice } from '../../common/rpc-client.util';
import { EMPLOYEES_PATTERNS } from '../../common/message-patterns';

export interface EmployeeSummary {
  id: number;
  name: string;
  email: string;
  role: string;
  job: string | null;
  department: string | null;
  age: number | null;
  gender: string | null;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class EmployeesClientService {
  constructor(
    @Inject('EMPLOYEES_SERVICE') private readonly client: ClientProxy,
  ) {}

  findOne(id: number): Promise<EmployeeSummary> {
    return callMicroservice(
      this.client.send(EMPLOYEES_PATTERNS.FIND_ONE, { id }),
    );
  }

  findByIds(ids: number[]): Promise<EmployeeSummary[]> {
    if (ids.length === 0) {
      return Promise.resolve([]);
    }
    return callMicroservice(
      this.client.send(EMPLOYEES_PATTERNS.FIND_BY_IDS, { ids }),
    );
  }
}
