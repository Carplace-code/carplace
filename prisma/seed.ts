// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.brand.createMany({
    data: [{ name: "Toyota" }, { name: "Ford" }, { name: "Honda" }],
  });

  await prisma.source.createMany({
    data: [
      {
        name: "fb_mkt",
        baseUrl: "https://www.facebook.com/marketplace/",
      },
      {
        name: "kavak",
        baseUrl: "https://www.kavak.com/cl",
      },
      {
        name: "yapo",
        baseUrl: "https://public-api.yapo.cl/",
      },
    ],
  });
}

main().finally(() => prisma.$disconnect());
