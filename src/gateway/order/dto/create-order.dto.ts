import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateOrderDto {
  @IsNotEmpty()
  customerName!: string;

  @IsNotEmpty()
  juice!: string;

  @IsNotEmpty()
  quantity!: number;

  @IsNotEmpty()
  address!: string;

  @IsNotEmpty()
  latitude!: number;

  @IsNotEmpty()
  longitude!: number;

  @IsNotEmpty()
  status!: number;

  @IsOptional()
  @IsNumber()
  employeeId?: number;

  @IsOptional()
  @IsString()
  rejectReason?: string;
}