import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Task } from '../tasks/entities/task.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'better-sqlite3',
  database: 'tasks.db',
  entities: [Task],
  synchronize: true,
};
