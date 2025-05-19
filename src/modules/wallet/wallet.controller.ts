import { Body, Controller, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { DepositDto } from './dto/deposit.dto';

@Controller('api/v1/wallet')
export class WalletController {
  constructor(private readonly WalletService: WalletService) {}

  @Post('deposit')
  async deposit(@Body() data: DepositDto) {
    return await this.WalletService.deposit(data);
  }
}
