import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Usuario } from '../models/Usuario';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const APPDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [Usuario],
  migrations: [],
  subscribers: [],
});
