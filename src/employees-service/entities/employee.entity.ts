import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EmployeeRole {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
}

export enum EmployeeGender {
  MALE = 'male',
  FEMALE = 'female',
}

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Exclude()
  @Column()
  password!: string;

  @Column({ type: 'enum', enum: EmployeeRole, default: EmployeeRole.EMPLOYEE })
  role!: EmployeeRole;

  @Column({ type: 'varchar', nullable: true })
  job!: string | null;

  @Column({ type: 'varchar', nullable: true })
  department!: string | null;

  @Column({ type: 'int', nullable: true })
  age!: number | null;

  @Column({ type: 'enum', enum: EmployeeGender, nullable: true })
  gender!: EmployeeGender | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
