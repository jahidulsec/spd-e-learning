import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const users: Prisma.usersCreateInput[] = [
  {
    sap_id: "sap-id-1",
    full_name: "mios 1",
    mobile: "01222333444",
    role: "mios",
  },
  {
    sap_id: "sap-id-2",
    full_name: "mios 2",
    mobile: "01222333445",
    role: "mios",
  },
  {
    sap_id: "sap-id-3",
    full_name: "team leader 1",
    mobile: "01222333446",
    role: "team_lead",
  },
];

const teams: Prisma.teamsCreateInput[] = [
  {
    id: "team-1",
    title: "Nephro",
  },
  {
    id: "team-2",
    title: "Onco",
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const a of users) {
    const user = await prisma.users.create({
      data: a,
    });
    console.log(`Created user with id: ${user.sap_id} and role: ${user.role}`);
  }

  for (const a of teams) {
    const user = await prisma.teams.create({
      data: a,
    });
    console.log(`Created team with id: ${user.id} `);
  }
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
