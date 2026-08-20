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
import { Line98MoveDto } from '../dto/move.dto';
import { Line98Service } from '../services/line98.service';

interface AuthRequest extends Request {
  user: { id: string; username: string };
}

@Controller('line98')
@UseGuards(JwtAuthGuard)
export class Line98Controller {
  constructor(private readonly line98Service: Line98Service) {}

  @Post()
  create(@Req() req: AuthRequest) {
    return this.line98Service.createGame(req.user.id);
  }

  @Get(':id')
  getGame(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.line98Service.getGame(id, req.user.id);
  }

  @Post(':id/move')
  move(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() body: Line98MoveDto,
  ) {
    return this.line98Service.move(
      id,
      req.user.id,
      body.fromRow,
      body.fromCol,
      body.toRow,
      body.toCol,
    );
  }

  @Get(':id/hint')
  hint(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.line98Service.hint(id, req.user.id);
  }
}
