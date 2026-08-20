import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CaroMoveDto } from '../dto/move.dto';
import { CaroService } from '../services/caro.service';

interface AuthRequest extends Request {
  user: { id: string; username: string };
}

@Controller('caro')
@UseGuards(JwtAuthGuard)
export class CaroController {
  constructor(private readonly caroService: CaroService) {}

  @Post('matchmaking')
  findMatch(@Req() req: AuthRequest) {
    return this.caroService.findMatch(req.user.id);
  }

  @Get('history')
  history(@Req() req: AuthRequest) {
    return this.caroService.getHistory(req.user.id);
  }

  @Get(':id')
  getMatch(@Param('id') id: string) {
    return this.caroService.getMatch(id);
  }

  @Post(':id/move')
  move(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() body: CaroMoveDto,
  ) {
    return this.caroService.placeMove(id, req.user.id, body.row, body.col);
  }
}
