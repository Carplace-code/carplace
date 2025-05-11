// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.brand.createMany({
    data: [{ name: "Toyota" }, { name: "Ford" }, { name: "Honda" }],
  });
}

main().finally(() => prisma.$disconnect());
