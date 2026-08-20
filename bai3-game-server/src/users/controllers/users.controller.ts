import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { UsersService } from '../services/users.service';

interface AuthRequest extends Request {
  user: { id: string; username: string };
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Req() req: AuthRequest, @Body() dto: UpdateProfileDto) {
    const user = await this.usersService.updateProfile(req.user.id, dto);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      nickname: user.nickname,
    };
  }
}
