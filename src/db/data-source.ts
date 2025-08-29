import { DataSource } from 'typeorm';
import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres', // Using PostgreSQL
  url: process.env.DATABASE_URL, 
  synchronize: false,  // Don't auto-sync schemas in prod, but ok for dev
  logging: true,  // true for dev, false for prod
  entities: ['src/models/*.ts'],  // Defined Patient and EligibilityCheck entities written in /models
  migrations: [],
});