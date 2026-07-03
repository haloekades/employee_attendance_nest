import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import {
  ATTENDANCES_PATTERNS,
  EMPLOYEE_EVENTS,
} from '../common/message-patterns';
import type { EmployeeDeletedEvent } from '../common/employee-deleted.event';
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { FindAttendanceQueryDto } from './dto/find-attendance-query.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Controller()
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @MessagePattern(ATTENDANCES_PATTERNS.CREATE)
  create(@Payload() createAttendanceDto: CreateAttendanceDto) {
    return this.attendancesService.create(createAttendanceDto);
  }

  @MessagePattern(ATTENDANCES_PATTERNS.FIND_ALL)
  findAll() {
    return this.attendancesService.findAll();
  }

  @MessagePattern(ATTENDANCES_PATTERNS.FIND_TODAY_BY_EMPLOYEE)
  findTodayByEmployee(@Payload() payload: { employeeId: number }) {
    return this.attendancesService.findTodayByEmployee(payload.employeeId);
  }

  @MessagePattern(ATTENDANCES_PATTERNS.FIND_BY_EMPLOYEE)
  findByEmployee(
    @Payload() payload: { employeeId: number; query: FindAttendanceQueryDto },
  ) {
    return this.attendancesService.findByEmployee(
      payload.employeeId,
      payload.query,
    );
  }

  @MessagePattern(ATTENDANCES_PATTERNS.FIND_ONE)
  findOne(@Payload() payload: { id: number }) {
    return this.attendancesService.findOne(payload.id);
  }

  @MessagePattern(ATTENDANCES_PATTERNS.UPDATE)
  update(@Payload() payload: { id: number; dto: UpdateAttendanceDto }) {
    return this.attendancesService.update(payload.id, payload.dto);
  }

  @MessagePattern(ATTENDANCES_PATTERNS.REMOVE)
  async remove(@Payload() payload: { id: number }) {
    await this.attendancesService.remove(payload.id);
    // A message handler that resolves to undefined never emits a reply
    // value over the RMQ transport, which makes the caller's
    // firstValueFrom() throw EmptyError instead of resolving - so an
    // explicit value must always be returned here.
    return null;
  }

  @EventPattern(EMPLOYEE_EVENTS.DELETED)
  handleEmployeeDeleted(@Payload() event: EmployeeDeletedEvent) {
    return this.attendancesService.removeByEmployeeId(event.employeeId);
  }
}
