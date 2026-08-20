import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { CaroBoard, CaroMoveRecord, CaroPlayer } from '../enums/caro.types';
import { CaroStatus } from '../enums/caro.types';

@Entity('caro_matches')
export class CaroMatch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  playerXId: string | null;

  @Column({ type: 'varchar', nullable: true })
  playerOId: string | null;

  @Column('simple-json')
  board: CaroBoard;

  @Column({ type: 'varchar', length: 1, default: 'X' })
  currentTurn: CaroPlayer;

  @Column({ type: 'varchar', length: 1, nullable: true })
  winner: CaroPlayer | null;

  @Column({ type: 'varchar', length: 20, default: CaroStatus.WAITING })
  status: CaroStatus;

  @Column('simple-json')
  moves: CaroMoveRecord[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
