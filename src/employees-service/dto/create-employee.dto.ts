import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Min,
  MinLength,
} from 'class-validator';
import { EmployeeGender, EmployeeRole } from '../entities/employee.entity';

export class CreateEmployeeDto {
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsEnum(EmployeeRole)
  role?: EmployeeRole;

  @IsNotEmpty()
  job!: string;

  @IsNotEmpty()
  department!: string;

  @IsInt()
  @Min(0)
  age!: number;

  @IsEnum(EmployeeGender)
  gender!: EmployeeGender;
}
