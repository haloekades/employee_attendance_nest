import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import type { EmployeeDeletedEvent } from '../../common/employee-deleted.event';
import { EMPLOYEE_EVENTS } from '../../common/message-patterns';

@Injectable()
export class AttendancesClientService {
  constructor(
    @Inject('ATTENDANCES_SERVICE') private readonly client: ClientProxy,
  ) {}

  employeeDeleted(event: EmployeeDeletedEvent): void {
    this.client.emit(EMPLOYEE_EVENTS.DELETED, event);
  }
}
