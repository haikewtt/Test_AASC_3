import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Line98Game } from '../entities/line98-game.entity';
import { Line98Status } from '../enums/line98-status.enum';
import {
  applyMove,
  createInitialGrid,
  suggestMove,
} from '../logic/line98.logic';

@Injectable()
export class Line98Service {
  constructor(
    @InjectRepository(Line98Game)
    private readonly gameRepository: Repository<Line98Game>,
  ) {}

  async createGame(userId: string): Promise<Line98Game> {
    const game = this.gameRepository.create({
      userId,
      grid: createInitialGrid(),
      score: 0,
      status: Line98Status.PLAYING,
    });
    return this.gameRepository.save(game);
  }

  async getGame(id: string, userId: string): Promise<Line98Game> {
    const game = await this.gameRepository.findOne({ where: { id } });
    if (!game || game.userId !== userId) {
      throw new NotFoundException('Game không tồn tại');
    }
    return game;
  }

  async move(
    id: string,
    userId: string,
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
  ): Promise<Line98Game> {
    const game = await this.getGame(id, userId);
    if (game.status === Line98Status.GAME_OVER) return game;

    const result = applyMove(
      game.grid,
      fromRow,
      fromCol,
      toRow,
      toCol,
      game.score,
    );
    if (!result) {
      throw new NotFoundException('Nước đi không hợp lệ');
    }

    game.grid = result.grid;
    game.score = result.score;
    if (result.gameOver) game.status = Line98Status.GAME_OVER;

    return this.gameRepository.save(game);
  }

  async hint(id: string, userId: string) {
    const game = await this.getGame(id, userId);
    return suggestMove(game.grid);
  }
}
