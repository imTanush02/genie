import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log(`Seeding database...`);

  // Add seed data here if needed
  // Example:
  // await prisma.project.create({
  //   data: {
  //     name: "my-first-project",
  //     userId: "user_xxx", // Clerk user ID
  //   },
  // });

  console.log(`Seeding complete.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });