import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Line98Service } from '../services/line98.service';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/line98' })
export class Line98Gateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly line98Service: Line98Service) {}

  @SubscribeMessage('joinGame')
  async joinGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string; userId: string },
  ) {
    client.join(`game:${data.gameId}`);
    const game = await this.line98Service.getGame(data.gameId, data.userId);
    client.emit('gameState', game);
  }

  @SubscribeMessage('move')
  async move(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      gameId: string;
      userId: string;
      fromRow: number;
      fromCol: number;
      toRow: number;
      toCol: number;
    },
  ) {
    const game = await this.line98Service.move(
      data.gameId,
      data.userId,
      data.fromRow,
      data.fromCol,
      data.toRow,
      data.toCol,
    );
    this.server.to(`game:${data.gameId}`).emit('gameState', game);
    return game;
  }

  @SubscribeMessage('hint')
  async hint(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { gameId: string; userId: string },
  ) {
    const hint = await this.line98Service.hint(data.gameId, data.userId);
    client.emit('hint', hint);
    return hint;
  }
}
