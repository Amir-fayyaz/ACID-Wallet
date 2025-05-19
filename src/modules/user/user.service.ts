import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly UserRepository: Repository<UserEntity>,
  ) {}

  public async getUserById(id: number) {
    const user = await this.UserRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException('user not found');

    return user;
  }
}
