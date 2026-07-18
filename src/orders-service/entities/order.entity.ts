import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  customerName!: string;

  @Column()
  juice!: string;

  @Column()
  quantity!: number;

  @Column()
  address!: string;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  latitude!: number;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  longitude!: number;

  @Column()
  status!: number;

  @Column({ type: 'text', nullable: true })
  rejectReason!: string | null;

  @Column()
  employeeId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
