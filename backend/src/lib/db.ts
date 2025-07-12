import { PrismaClient } from "@prisma/client";

const gloabalPrisma = globalThis as unknown as {
    prisma:PrismaClient | undefined
}

export const prisma = gloabalPrisma.prisma ?? new PrismaClient();

if(process.env.NODE_ENV !== 'production') gloabalPrisma.prisma =prisma;