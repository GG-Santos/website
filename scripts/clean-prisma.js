const fs = require('fs');
const path = require('path');

const prismaClientPath = path.join(process.cwd(), 'node_modules', '.prisma', 'client');

try {
  if (fs.existsSync(prismaClientPath)) {
    fs.rmSync(prismaClientPath, { recursive: true, force: true });
    console.log('✓ Cleaned Prisma client directory');
  }
} catch (error) {
  console.error('Error cleaning Prisma client directory:', error);
  process.exit(1);
}

