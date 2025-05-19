import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/user/entities/user.entity';
export const TypeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  username: 'root',
  password: 'amir8383',
  host: 'localhost',
  port: 3306,
  database: 'wallet',
  entities: [UserEntity],
  synchronize: true,
};
