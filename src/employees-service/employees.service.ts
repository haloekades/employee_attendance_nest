import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { In, Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';

const SALT_ROUNDS = 10;

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const existing = await this.employeesRepository.findOne({
      where: { email: createEmployeeDto.email },
    });
    if (existing) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(
      createEmployeeDto.password,
      SALT_ROUNDS,
    );
    const employee = this.employeesRepository.create({
      ...createEmployeeDto,
      password: hashedPassword,
    });
    return this.employeesRepository.save(employee);
  }

  findAll(): Promise<Employee[]> {
    return this.employeesRepository.find();
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeesRepository.findOne({
      where: { id },
    });
    if (!employee) {
      throw new NotFoundException(`Employee ${id} not found`);
    }
    return employee;
  }

  findByEmail(email: string): Promise<Employee | null> {
    return this.employeesRepository.findOne({ where: { email } });
  }

  findByIds(ids: number[]): Promise<Employee[]> {
    if (ids.length === 0) {
      return Promise.resolve([]);
    }
    return this.employeesRepository.find({ where: { id: In(ids) } });
  }

  async update(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const employee = await this.findOne(id);

    if (updateEmployeeDto.email && updateEmployeeDto.email !== employee.email) {
      const existing = await this.employeesRepository.findOne({
        where: { email: updateEmployeeDto.email },
      });
      if (existing) {
        throw new ConflictException('Email already in use');
      }
    }

    const { password, ...rest } = updateEmployeeDto;
    Object.assign(employee, rest);
    if (password) {
      employee.password = await bcrypt.hash(password, SALT_ROUNDS);
    }

    return this.employeesRepository.save(employee);
  }

  async remove(id: number): Promise<void> {
    const result = await this.employeesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Employee ${id} not found`);
    }
  }
}
