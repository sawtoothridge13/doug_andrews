import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('lazy5u5an', 10);

  await prisma.user.upsert({
    where: { email: 'doug@doug-andrews.net' },
    update: {},
    create: {
      email: 'doug@doug-andrews.net',
      name: 'Doug',
      password: hashedPassword,
      isAdmin: true,
    },
  });

  console.log('Seeded admin user successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
