import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CaroController } from './controllers/caro.controller';
import { CaroMatch } from './entities/caro-match.entity';
import { CaroGateway } from './gateways/caro.gateway';
import { CaroService } from './services/caro.service';

@Module({
  imports: [TypeOrmModule.forFeature([CaroMatch]), AuthModule],
  controllers: [CaroController],
  providers: [CaroService, CaroGateway],
  exports: [CaroService],
})
export class CaroModule {}
