import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class WithDrawDto {
  @ApiProperty()
  @IsNumber()
  productId: number;

  @ApiProperty()
  @IsNumber()
  userId: number;
}
