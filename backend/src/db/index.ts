import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'hottest100',
  password: 'test',
  port: 5432
});

export const query = async (text: string, params: any[]) =>
  pool.query(text, params);
