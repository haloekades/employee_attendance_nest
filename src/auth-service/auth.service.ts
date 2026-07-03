import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../common/jwt-payload';
import { LoginDto } from './dto/login.dto';
import {
  EmployeesClientService,
  EmployeeWithPassword,
} from './employees-client/employees-client.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly employeesClient: EmployeesClientService,
    private readonly jwtService: JwtService,
  ) {}

  async validateEmployee(
    email: string,
    password: string,
  ): Promise<EmployeeWithPassword> {
    const employee = await this.employeesClient.findByEmail(email);
    if (!employee || !(await bcrypt.compare(password, employee.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return employee;
  }

  async login(loginDto: LoginDto) {
    const employee = await this.validateEmployee(
      loginDto.email,
      loginDto.password,
    );

    const payload: JwtPayload = {
      sub: employee.id,
      email: employee.email,
      role: employee.role,
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...safeEmployee } = employee;

    return {
      access_token: this.jwtService.sign(payload),
      employee: safeEmployee,
    };
  }
}
