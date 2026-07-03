import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AttendancesClientService } from './attendances-client.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { FindAttendanceQueryDto } from './dto/find-attendance-query.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesClient: AttendancesClientService) {}

  @Post()
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendancesClient.create(createAttendanceDto);
  }

  @Get()
  findAll() {
    return this.attendancesClient.findAll();
  }

  @Get('employee/:employeeId/today')
  findTodayByEmployee(@Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.attendancesClient.findTodayByEmployee(employeeId);
  }

  @Get('employee/:employeeId')
  findByEmployee(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Query() query: FindAttendanceQueryDto,
  ) {
    return this.attendancesClient.findByEmployee(employeeId, query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.attendancesClient.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return this.attendancesClient.update(id, updateAttendanceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.attendancesClient.remove(id);
  }
}
