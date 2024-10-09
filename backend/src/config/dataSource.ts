import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../models/userModel';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3307,
  username: 'root',
  password: 'root',
  database: 'SIGL_Test', // Remplace par le nom de ta base de données
  synchronize: true,
  entities: [User],
});
