import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const badges = [
    {
      code: "FIRST_TRIP",
      title: "First Trip Logged",
      description: "You logged your very first trip!"
    },
    {
      code: "FIVE_DAYS_STREAK",
      title: "On a Roll",
      description: "You logged trips 5 days in a row."
    },
    {
      code: "100_KM_TOTAL",
      title: "Century Rider",
      description: "You have travelled 100 km using TripChain."
    }
  ];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { code: badge.code },
      update: {},
      create: badge
    });
  }

  console.log("Badges seeded.");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
