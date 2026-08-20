import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Line98Controller } from './controllers/line98.controller';
import { Line98Game } from './entities/line98-game.entity';
import { Line98Gateway } from './gateways/line98.gateway';
import { Line98Service } from './services/line98.service';

@Module({
  imports: [TypeOrmModule.forFeature([Line98Game]), AuthModule],
  controllers: [Line98Controller],
  providers: [Line98Service, Line98Gateway],
  exports: [Line98Service],
})
export class Line98Module {}
