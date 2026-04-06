import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config({ override: true });

export default new DataSource({
  type: 'postgres',
  host: process.env.HOST,
  port: Number(process.env.PORT) || 5433,
  username: process.env.USERNAME || 'postgres',
  password: 'admin',
  database: process.env.DATABASE,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  synchronize: false,
});
