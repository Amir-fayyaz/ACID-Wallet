import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

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

  public async createUser(data: CreateUserDto) {
    const user = await this.UserRepository.findOne({
      where: { mobile: data.mobile },
    });

    if (!user) {
      const newUser = this.UserRepository.create(data);
      return await this.UserRepository.save(newUser);
    }

    return user;
  }
}
