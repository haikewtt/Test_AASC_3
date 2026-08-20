import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { CaroModule } from './caro/caro.module';
import { databaseConfig } from './config/database.config';
import { Line98Module } from './line98/line98.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/',
    }),
    AuthModule,
    UsersModule,
    Line98Module,
    CaroModule,
  ],
})
export class AppModule {}
