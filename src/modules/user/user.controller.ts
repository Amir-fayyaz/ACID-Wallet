import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('api/v1/users')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) userId: number) {
    return await this.UserService.getUserById(userId);
  }
}
