import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatus } from '../enums/task-status.enum';

@Entity('tasks')
export class Task {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Hoàn thành bài kiểm tra NestJS' })
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @ApiProperty({ example: 'Triển khai CRUD API với TypeORM' })
  @Column({ type: 'text', default: '' })
  description: string;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.TODO })
  @Column({
    type: 'varchar',
    length: 20,
    default: TaskStatus.TODO,
  })
  status: TaskStatus;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;
}
