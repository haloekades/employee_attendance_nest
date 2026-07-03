import { IsDateString, IsInt, IsOptional } from 'class-validator';

export class CreateAttendanceDto {
  @IsInt()
  employeeId: number;

  @IsDateString()
  clockIn: string;

  @IsOptional()
  @IsDateString()
  clockOut?: string;
}
