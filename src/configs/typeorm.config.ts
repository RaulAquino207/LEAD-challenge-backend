import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'Raulaquino@2011',
  database: 'net_promoter_score',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};