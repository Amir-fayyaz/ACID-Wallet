import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletEntity } from './entities/wallet.entity';
import { DataSource, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { DepositDto } from './dto/deposit.dto';
import { UserEntity } from '../user/entities/user.entity';
import { WalletType } from './enum/walletType.enum';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly WalletRepository: Repository<WalletEntity>,
    private readonly UserService: UserService,
    private readonly DataSource: DataSource,
  ) {}

  public async deposit(data: DepositDto) {
    //Create QueryRunner & sure to connection

    const queryRunner = this.DataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      const { amount, fullName, mobile } = data;
      const user = await this.UserService.createUser({ mobile, fullName });

      //Starting Transacion
      const userData = await queryRunner.manager.findOneBy(UserEntity, {
        id: user.id,
      });
      const newBalance = userData.balance + amount;
      await queryRunner.manager.update(
        UserEntity,
        { id: user.id },
        { balance: newBalance },
      );
      await queryRunner.manager.insert(WalletEntity, {
        amount,
        userId: userData.id,
        type: WalletType.Deposit,
        invoice_number: `${Date.now()}-${userData.id}`,
      });
      //Close transAction
      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException();
    }

    return { message: 'Payment was successfully' };
  }
}
