import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CaroStatus } from '../enums/caro.types';
import { CaroService } from '../services/caro.service';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/caro' })
export class CaroGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly caroService: CaroService) {}

  @SubscribeMessage('findMatch')
  async findMatch(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string },
  ) {
    const match = await this.caroService.findMatch(data.userId);
    client.join(`match:${match.id}`);

    if (match.playerOId) {
      this.server.to(`match:${match.id}`).emit('matchFound', match);
    } else {
      client.emit('waiting', { matchId: match.id });
    }
    return match;
  }

  @SubscribeMessage('joinMatch')
  async joinMatch(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { matchId: string },
  ) {
    client.join(`match:${data.matchId}`);
    const match = await this.caroService.getMatch(data.matchId);
    client.emit('matchState', match);
    return match;
  }

  @SubscribeMessage('move')
  async move(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { matchId: string; userId: string; row: number; col: number },
  ) {
    const match = await this.caroService.placeMove(
      data.matchId,
      data.userId,
      data.row,
      data.col,
    );
    this.server.to(`match:${data.matchId}`).emit('matchState', match);
    if (match.winner || match.status === CaroStatus.FINISHED) {
      this.server.to(`match:${data.matchId}`).emit('gameOver', {
        winner: match.winner,
        match,
      });
    }
    return match;
  }

  @SubscribeMessage('leaveQueue')
  leaveQueue(@MessageBody() data: { userId: string }) {
    this.caroService.leaveQueue(data.userId);
    return { ok: true };
  }
}
