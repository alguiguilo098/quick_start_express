import { PrismaClient } from '@prisma/client';
import { errorHandlerFunc } from '../errorhandler/errorfunc';
import { appendFileSync } from 'fs';
const prisma = new PrismaClient();
export const testDbConnection = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully.');
  } catch (error) {
    const timeStamp = new Date().toLocaleString();
    const errMessage = `[ERROR]: ${timeStamp} - ${error}`;
    console.error(errMessage);
    appendFileSync(`./logs/db.log`, `${errMessage}\n`);
    process.exit(1);
  }
};
