// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  const user = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      password: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
      isVerified: true,
      profile: {
        create: {
          riskTolerance: 'MEDIUM',
          investmentGoals: ['Growth', 'Income'],
          totalInvested: 10000,
          currentValue: 10500
        }
      },
      portfolios: {
        create: {
          name: 'Demo Portfolio',
          description: 'Sample portfolio for demo user',
          isDefault: true,
          holdings: {
            create: [
              {
                symbol: 'AAPL',
                quantity: 10,
                avgPrice: 150.00,
                currentPrice: 193.42
              },
              {
                symbol: 'GOOGL',
                quantity: 5,
                avgPrice: 2500.00,
                currentPrice: 142.56
              }
            ]
          }
        }
      }
    }
  });
  
  console.log('Demo user created:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });