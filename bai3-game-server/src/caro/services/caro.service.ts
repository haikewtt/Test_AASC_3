import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CaroMatch } from '../entities/caro-match.entity';
import {
  CaroMoveRecord,
  CaroPlayer,
  CaroStatus,
} from '../enums/caro.types';
import { applyCaroMove, createBoard } from '../logic/caro.logic';

@Injectable()
export class CaroService {
  private readonly matchmakingQueue: string[] = [];

  constructor(
    @InjectRepository(CaroMatch)
    private readonly matchRepository: Repository<CaroMatch>,
  ) {}

  async findMatch(userId: string): Promise<CaroMatch> {
    const waitingMatch = await this.matchRepository.findOne({
      where: { status: CaroStatus.WAITING },
      order: { createdAt: 'ASC' },
    });

    if (waitingMatch && waitingMatch.playerXId !== userId) {
      waitingMatch.playerOId = userId;
      waitingMatch.status = CaroStatus.PLAYING;
      this.leaveQueue(userId);
      return this.matchRepository.save(waitingMatch);
    }

    if (!this.matchmakingQueue.includes(userId)) {
      this.matchmakingQueue.push(userId);
    }

    const match = this.matchRepository.create({
      playerXId: userId,
      playerOId: null,
      board: createBoard(),
      currentTurn: 'X',
      winner: null,
      status: CaroStatus.WAITING,
      moves: [],
    });
    return this.matchRepository.save(match);
  }

  async getMatch(id: string): Promise<CaroMatch> {
    const match = await this.matchRepository.findOne({ where: { id } });
    if (!match) throw new NotFoundException('Trận đấu không tồn tại');
    return match;
  }

  getPlayerRole(match: CaroMatch, userId: string): CaroPlayer | null {
    if (match.playerXId === userId) return 'X';
    if (match.playerOId === userId) return 'O';
    return null;
  }

  async placeMove(
    matchId: string,
    userId: string,
    row: number,
    col: number,
  ): Promise<CaroMatch> {
    const match = await this.getMatch(matchId);
    if (match.status !== CaroStatus.PLAYING) {
      throw new BadRequestException('Trận đấu chưa bắt đầu hoặc đã kết thúc');
    }

    const role = this.getPlayerRole(match, userId);
    if (!role) throw new BadRequestException('Bạn không thuộc trận đấu này');
    if (match.currentTurn !== role) {
      throw new BadRequestException('Chưa đến lượt bạn');
    }

    const result = applyCaroMove(match.board, row, col, role);
    if (!result) throw new BadRequestException('Nước đi không hợp lệ');

    match.board = result.board;
    const move: CaroMoveRecord = {
      row,
      col,
      player: role,
      timestamp: new Date().toISOString(),
    };
    match.moves = [...match.moves, move];

    if (result.winner) {
      match.winner = result.winner;
      match.status = CaroStatus.FINISHED;
    } else if (result.draw) {
      match.status = CaroStatus.FINISHED;
    } else {
      match.currentTurn = role === 'X' ? 'O' : 'X';
    }

    return this.matchRepository.save(match);
  }

  async getHistory(userId: string): Promise<CaroMatch[]> {
    return this.matchRepository.find({
      where: [{ playerXId: userId }, { playerOId: userId }],
      order: { createdAt: 'DESC' },
      take: 20,
    });
  }

  leaveQueue(userId: string): void {
    const idx = this.matchmakingQueue.indexOf(userId);
    if (idx >= 0) this.matchmakingQueue.splice(idx, 1);
  }
}
