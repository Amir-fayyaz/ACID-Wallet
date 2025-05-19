import { Base } from 'src/common/entities/base-entity';
import { Column, Entity } from 'typeorm';

@Entity('user')
export class UserEntity extends Base {
  @Column({ type: 'varchar', nullable: false })
  fullName: string;

  @Column({ type: 'varchar', unique: true })
  mobile: string;

  @Column({ type: 'double', default: 0 })
  balance: number;
}
