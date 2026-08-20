import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Line98Status } from '../enums/line98-status.enum';

@Entity('line98_games')
export class Line98Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  userId: string;

  @Column('simple-json')
  grid: number[][];

  @Column({ default: 0 })
  score: number;

  @Column({ type: 'varchar', length: 20, default: Line98Status.PLAYING })
  status: Line98Status;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
