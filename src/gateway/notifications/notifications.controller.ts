import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EMPLOYEE_EVENTS } from '../../common/message-patterns';
import type { EmployeeUpdatedEvent } from '../../common/employee-updated.event';
import { NotificationsGateway } from './notifications.gateway';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsGateway: NotificationsGateway) {}

  @EventPattern(EMPLOYEE_EVENTS.UPDATED)
  handleEmployeeUpdated(@Payload() event: EmployeeUpdatedEvent) {
    this.notificationsGateway.notifyEmployeeUpdated(event);
  }
}
