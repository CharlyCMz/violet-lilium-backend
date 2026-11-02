import { DataSource } from 'typeorm';
import { join } from 'path';
import loadConfig from '../config';

const config = loadConfig();

export default new DataSource({
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: process.env.MIGRATION_DB ?? config.database.dbName,
  entities: [join(__dirname, '/../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '/migrations/*{.ts,.js}')],
});
