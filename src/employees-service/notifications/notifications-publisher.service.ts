import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EmployeeUpdatedEvent } from '../../common/employee-updated.event';
import { EMPLOYEE_EVENTS } from '../../common/message-patterns';

@Injectable()
export class NotificationsPublisherService {
  constructor(
    @Inject('NOTIFICATIONS_SERVICE') private readonly client: ClientProxy,
  ) {}

  employeeUpdated(event: EmployeeUpdatedEvent): void {
    this.client.emit(EMPLOYEE_EVENTS.UPDATED, event);
  }
}
