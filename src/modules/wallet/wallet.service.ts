import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletEntity } from './entities/wallet.entity';
import { DataSource, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { DepositDto } from './dto/deposit.dto';
import { UserEntity } from '../user/entities/user.entity';
import { WalletType } from './enum/walletType.enum';
import { Products } from 'src/common/data/product.data';
import { WithDrawDto } from './dto/withdraw.dto';

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
      await queryRunner.startTransaction();
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
      //Commit transAction
      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException(error.message);
    }

    return { message: 'Balance Charged successfully' };
  }

  public async withdraw(data: WithDrawDto) {
    const { productId, userId } = data;
    const product = Products.find((product) => product.id === productId);

    if (!product) throw new NotFoundException('Product not found');

    const queryRunner = this.DataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();

      const user = await queryRunner.manager.findOneBy(UserEntity, {
        id: userId,
      });
      if (!user) throw new NotFoundException('User not found');

      if (user.balance < product.price)
        throw new BadRequestException('Not enough balance');

      const newBalance = user.balance - product.price;

      await queryRunner.manager.update(
        UserEntity,
        { id: userId },
        { balance: newBalance },
      );

      await queryRunner.manager.insert(WalletEntity, {
        amount: product.price,
        userId,
        invoice_number: `${Date.now()}-${userId}`,
        type: WalletType.WithDraw,
      });
      //Commit transActions
      await queryRunner.commitTransaction();
    } catch (error) {
      //rollBack
      console.log(1);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
    return {
      message: 'Payments was successfully',
    };
  }
}
