import { defineConfig } from '@c15t/backend/v2';
import { prismaAdapter } from '@c15t/backend/v2/db/adapters/prisma';
import { PrismaClient } from './generated/client';

const prisma = new PrismaClient({
	log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default defineConfig({
	adapter: prismaAdapter({ provider: 'mongodb', prisma }),
});
