import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  create(username: string, hashedPassword: string): Promise<User> {
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      nickname: username,
    });
    return this.userRepository.save(user);
  }

  async updateProfile(
    userId: string,
    data: { email?: string; nickname?: string },
  ): Promise<User> {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    if (data.email !== undefined) user.email = data.email;
    if (data.nickname !== undefined) user.nickname = data.nickname;
    return this.userRepository.save(user);
  }
}
