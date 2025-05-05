import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma: PrismaClient =
  // @ts-expect-error global is not typed, so typescript will complain
  (process.env.NODE_ENV === "production" || !global.prisma ? new PrismaClient() : global.prisma).$extends(
    withAccelerate(),
  );

// @ts-expect-error global is not typed, so typescript will complain
if (process.env.NODE_ENV !== "production" && !global.prisma) global.prisma = prisma;

export default prisma;
