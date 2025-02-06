import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.development.env' });

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: configService.get<string>('DB_TYPE') as 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  // Carica tutte le entità
  entities: [__dirname + '/**/*.entities.{js,ts}'],
  // Percorso delle migrazioni
  migrations: [__dirname + '/migrations/*.{js,ts}'],
  // Deve essere false quando usi le migrazioni
  synchronize: false,
  logging: true,
});