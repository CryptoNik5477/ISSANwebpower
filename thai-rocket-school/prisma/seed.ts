// CLI entry point — run with: npm run db:seed
// Seeds the full Thai Rocket School curriculum: 2 courses, 19 levels, ~120
// lessons, 19 exams, achievements and demo accounts (admin + student).
// Shared logic lives in src/lib/seed.ts (also used by the protected
// /api/admin/seed route for environments without local DB access).

import { PrismaClient } from "@prisma/client";
import { runSeed } from "../src/lib/seed";

const prisma = new PrismaClient();

runSeed(prisma)
  .then((summary) => {
    console.log(`Seed complete ✔ — ${summary.courses} courses, ${summary.levels} levels, ${summary.achievements} achievements`);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
