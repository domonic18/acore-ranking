import { DataSource } from 'typeorm';
import { join } from 'path';
import { env } from './env';

export const authDataSource = new DataSource({
  type: 'mysql',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_AUTH,
  entities: [join(__dirname, '..', 'entities', 'auth', '*.entity.{js,ts}')],
  synchronize: false,
  logging: env.NODE_ENV === 'development',
});

export const charactersDataSource = new DataSource({
  type: 'mysql',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_CHARACTERS,
  entities: [join(__dirname, '..', 'entities', 'characters', '*.entity.{js,ts}')],
  synchronize: false,
  logging: env.NODE_ENV === 'development',
});

export const worldDataSource = new DataSource({
  type: 'mysql',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_WORLD,
  entities: [join(__dirname, '..', 'entities', 'world', '*.entity.{js,ts}')],
  synchronize: false,
  logging: env.NODE_ENV === 'development',
});

export async function initializeDataSources(): Promise<void> {
  await Promise.all([
    authDataSource.initialize(),
    charactersDataSource.initialize(),
    worldDataSource.initialize(),
  ]);
}
