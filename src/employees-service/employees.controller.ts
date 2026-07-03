import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EMPLOYEES_PATTERNS } from '../common/message-patterns';
import { AttendancesClientService } from './attendances-client/attendances-client.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';
import { EmployeesService } from './employees.service';
import { NotificationsPublisherService } from './notifications/notifications-publisher.service';

// The gateway has no ClassSerializerInterceptor/@Exclude visibility into
// entities it receives over RabbitMQ, so the password hash must be
// stripped here at the source for every pattern except FIND_BY_EMAIL,
// which auth-service needs the hash from to verify credentials.
function omitPassword(employee: Employee): Omit<Employee, 'password'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _password, ...rest } = employee;
  return rest;
}

@Controller()
export class EmployeesController {
  constructor(
    private readonly employeesService: EmployeesService,
    private readonly notificationsPublisher: NotificationsPublisherService,
    private readonly attendancesClient: AttendancesClientService,
  ) {}

  @MessagePattern(EMPLOYEES_PATTERNS.CREATE)
  async create(@Payload() createEmployeeDto: CreateEmployeeDto) {
    return omitPassword(await this.employeesService.create(createEmployeeDto));
  }

  @MessagePattern(EMPLOYEES_PATTERNS.FIND_ALL)
  async findAll() {
    return (await this.employeesService.findAll()).map(omitPassword);
  }

  @MessagePattern(EMPLOYEES_PATTERNS.FIND_ONE)
  async findOne(@Payload() payload: { id: number }) {
    return omitPassword(await this.employeesService.findOne(payload.id));
  }

  @MessagePattern(EMPLOYEES_PATTERNS.FIND_BY_IDS)
  async findByIds(@Payload() payload: { ids: number[] }) {
    return (await this.employeesService.findByIds(payload.ids)).map(
      omitPassword,
    );
  }

  @MessagePattern(EMPLOYEES_PATTERNS.FIND_BY_EMAIL)
  findByEmail(@Payload() payload: { email: string }) {
    return this.employeesService.findByEmail(payload.email);
  }

  @MessagePattern(EMPLOYEES_PATTERNS.UPDATE)
  async update(@Payload() payload: { id: number; dto: UpdateEmployeeDto }) {
    const updated = await this.employeesService.update(payload.id, payload.dto);

    this.notificationsPublisher.employeeUpdated({
      employeeId: updated.id,
      name: updated.name,
      changedFields: Object.keys(payload.dto),
      updatedAt: updated.updatedAt.toISOString(),
    });

    return omitPassword(updated);
  }

  @MessagePattern(EMPLOYEES_PATTERNS.REMOVE)
  async remove(@Payload() payload: { id: number }) {
    await this.employeesService.remove(payload.id);
    this.attendancesClient.employeeDeleted({ employeeId: payload.id });
    // See the equivalent comment in attendances-service: a handler that
    // resolves to undefined never emits a reply value over the RMQ
    // transport, which turns into an EmptyError on the caller's side.
    return null;
  }
}
