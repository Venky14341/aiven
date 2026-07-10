import { Sequelize } from 'sequelize';

const DB_NAME = process.env.MYSQL_DATABASE || 'investiq';
const DB_USER = process.env.MYSQL_USER || 'root';
const DB_PASS = process.env.MYSQL_PASSWORD || '';
const DB_HOST = process.env.MYSQL_HOST || 'localhost';
const DB_PORT = Number(process.env.MYSQL_PORT || 3306);

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: false,
});
