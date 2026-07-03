import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ATTENDANCES_PATTERNS } from '../../common/message-patterns';
import { sendRpc } from '../../common/rpc-to-http.util';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { FindAttendanceQueryDto } from './dto/find-attendance-query.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendancesClientService {
  constructor(
    @Inject('ATTENDANCES_SERVICE') private readonly client: ClientProxy,
  ) {}

  create(createAttendanceDto: CreateAttendanceDto) {
    return sendRpc(
      this.client.send(ATTENDANCES_PATTERNS.CREATE, createAttendanceDto),
    );
  }

  findAll() {
    return sendRpc(this.client.send(ATTENDANCES_PATTERNS.FIND_ALL, {}));
  }

  findTodayByEmployee(employeeId: number) {
    return sendRpc(
      this.client.send(ATTENDANCES_PATTERNS.FIND_TODAY_BY_EMPLOYEE, {
        employeeId,
      }),
    );
  }

  findByEmployee(employeeId: number, query: FindAttendanceQueryDto) {
    return sendRpc(
      this.client.send(ATTENDANCES_PATTERNS.FIND_BY_EMPLOYEE, {
        employeeId,
        query,
      }),
    );
  }

  findOne(id: number) {
    return sendRpc(this.client.send(ATTENDANCES_PATTERNS.FIND_ONE, { id }));
  }

  update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    return sendRpc(
      this.client.send(ATTENDANCES_PATTERNS.UPDATE, {
        id,
        dto: updateAttendanceDto,
      }),
    );
  }

  remove(id: number) {
    return sendRpc(this.client.send(ATTENDANCES_PATTERNS.REMOVE, { id }));
  }
}
