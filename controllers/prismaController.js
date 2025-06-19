import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function connectDB() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error);
    process.exit(1); // Optional: Exit the app if DB connection fails
  }
}

connectDB();


export default prisma;
