import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import {
  EmployeesClientService,
  EmployeeSummary,
} from './employees-client/employees-client.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { FindAttendanceQueryDto } from './dto/find-attendance-query.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Attendance } from './entities/attendance.entity';

export interface AttendanceWithEmployee extends Attendance {
  employee: EmployeeSummary | null;
}

@Injectable()
export class AttendancesService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendancesRepository: Repository<Attendance>,
    private readonly employeesClient: EmployeesClientService,
  ) {}

  // Attendance/employee live in separate services with no DB-level FK, so
  // an employeeId can legitimately point at a since-deleted employee.
  // Read paths degrade to `employee: null` rather than failing the whole
  // request; write paths (create/update) still hard-validate via
  // employeesClient.findOne(), which throws if the id doesn't exist.
  private async tryFindEmployee(id: number): Promise<EmployeeSummary | null> {
    try {
      return await this.employeesClient.findOne(id);
    } catch {
      return null;
    }
  }

  private async attachEmployee(
    attendance: Attendance,
  ): Promise<AttendanceWithEmployee> {
    return {
      ...attendance,
      employee: await this.tryFindEmployee(attendance.employeeId),
    };
  }

  private async attachEmployees(
    attendances: Attendance[],
  ): Promise<AttendanceWithEmployee[]> {
    const employeeIds = [...new Set(attendances.map((a) => a.employeeId))];
    const employees = await this.employeesClient.findByIds(employeeIds);
    const employeesById = new Map(employees.map((e) => [e.id, e]));

    return attendances.map((attendance) => ({
      ...attendance,
      employee: employeesById.get(attendance.employeeId) ?? null,
    }));
  }

  async create(
    createAttendanceDto: CreateAttendanceDto,
  ): Promise<AttendanceWithEmployee> {
    const employee = await this.employeesClient.findOne(
      createAttendanceDto.employeeId,
    );
    const attendance = this.attendancesRepository.create(createAttendanceDto);
    const saved = await this.attendancesRepository.save(attendance);
    return { ...saved, employee };
  }

  async findAll(): Promise<AttendanceWithEmployee[]> {
    const attendances = await this.attendancesRepository.find();
    return this.attachEmployees(attendances);
  }

  async findByEmployee(
    employeeId: number,
    query: FindAttendanceQueryDto,
  ): Promise<AttendanceWithEmployee[]> {
    const employee = await this.tryFindEmployee(employeeId);

    const { start, end } = this.resolveDateRange(query);

    const attendances = await this.attendancesRepository.find({
      where: {
        employeeId,
        ...(start && end ? { clockIn: Between(start, end) } : {}),
      },
      order: { clockIn: 'ASC' },
    });

    return attendances.map((attendance) => ({ ...attendance, employee }));
  }

  async findTodayByEmployee(
    employeeId: number,
  ): Promise<AttendanceWithEmployee[]> {
    const employee = await this.tryFindEmployee(employeeId);

    const { start, end } = this.startAndEndOfDay(new Date());

    const attendances = await this.attendancesRepository.find({
      where: { employeeId, clockIn: Between(start, end) },
      order: { clockIn: 'ASC' },
    });

    return attendances.map((attendance) => ({ ...attendance, employee }));
  }

  private startAndEndOfDay(date: Date): { start: Date; end: Date } {
    return {
      start: new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        0,
        0,
        0,
        0,
      ),
      end: new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        23,
        59,
        59,
        999,
      ),
    };
  }

  private resolveDateRange(query: FindAttendanceQueryDto): {
    start?: Date;
    end?: Date;
  } {
    if (query.month) {
      const [year, month] = query.month.split('-').map(Number);
      const now = new Date();
      const isCurrentMonth =
        year === now.getFullYear() && month - 1 === now.getMonth();

      const lastDayOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
      const endOfToday = this.startAndEndOfDay(now).end;

      return {
        start: new Date(year, month - 1, 1, 0, 0, 0, 0),
        end: isCurrentMonth ? endOfToday : lastDayOfMonth,
      };
    }

    if (!query.startDate && !query.endDate) {
      return {};
    }

    const start = query.startDate ? new Date(query.startDate) : new Date(0);
    const end = query.endDate ? new Date(query.endDate) : new Date();

    if (start > end) {
      throw new BadRequestException('startDate must be before endDate');
    }

    return { start, end };
  }

  async findOne(id: number): Promise<AttendanceWithEmployee> {
    const attendance = await this.attendancesRepository.findOne({
      where: { id },
    });
    if (!attendance) {
      throw new NotFoundException(`Attendance ${id} not found`);
    }
    return this.attachEmployee(attendance);
  }

  async update(
    id: number,
    updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<AttendanceWithEmployee> {
    const attendance = await this.attendancesRepository.findOne({
      where: { id },
    });
    if (!attendance) {
      throw new NotFoundException(`Attendance ${id} not found`);
    }

    if (updateAttendanceDto.employeeId) {
      await this.employeesClient.findOne(updateAttendanceDto.employeeId);
    }

    Object.assign(attendance, updateAttendanceDto);
    const saved = await this.attendancesRepository.save(attendance);
    return this.attachEmployee(saved);
  }

  async remove(id: number): Promise<void> {
    const result = await this.attendancesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Attendance ${id} not found`);
    }
  }

  // Triggered by the employee.deleted event - there's no DB-level FK across
  // services, so cascading on delete has to happen here explicitly.
  async removeByEmployeeId(employeeId: number): Promise<void> {
    await this.attendancesRepository.delete({ employeeId });
  }
}
