import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/services/users.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByUsername(dto.username);
    if (existing) {
      throw new ConflictException('Username đã tồn tại');
    }
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create(dto.username, hashed);
    return this.buildAuthResponse(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByUsername(dto.username);
    if (!user) {
      throw new UnauthorizedException('Sai username hoặc password');
    }
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Sai username hoặc password');
    }
    return this.buildAuthResponse(user);
  }

  private buildAuthResponse(user: {
    id: string;
    username: string;
    email: string | null;
    nickname: string | null;
  }) {
    const payload = { sub: user.id, username: user.username };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        nickname: user.nickname,
      },
    };
  }
}
