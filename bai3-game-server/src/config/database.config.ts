import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CaroMatch } from '../caro/entities/caro-match.entity';
import { Line98Game } from '../line98/entities/line98-game.entity';
import { User } from '../users/entities/user.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'better-sqlite3',
  database: 'game.db',
  entities: [User, Line98Game, CaroMatch],
  synchronize: true,
};
