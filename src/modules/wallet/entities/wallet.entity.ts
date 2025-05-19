import { Base } from 'src/common/entities/base-entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { WalletType } from '../enum/walletType.enum';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Entity('wallet')
export class WalletEntity extends Base {
  @Column({ type: 'enum', enum: WalletType, nullable: false })
  type: WalletType;

  @Column({ type: 'varchar', nullable: false })
  invoice_number: string;

  @Column({ type: 'double', nullable: false })
  amount: number;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.transactions, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
