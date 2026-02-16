/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";
import { Prisma } from "../generated/prisma/client";
import { prisma } from "@/lib/db";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Case helpers ─────────────────────────────────────────────────────────────

function toPascalCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toCamelCase(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

// ─── Sequence reset ───────────────────────────────────────────────────────────
// Uses the @@map table name (lowercase) from the schema so pg_get_serial_sequence
// can resolve the sequence correctly. User IDs are strings (uuid), so we skip
// the four better-auth tables which have no integer PK.

const STRING_PK_MODELS = new Set([
  "user",
  "session",
  "account",
  "verification",
]);

// Maps the JSON file base name → actual Postgres table name (from @@map).
// Only needed where they differ from the default Prisma naming.
const TABLE_NAME_MAP: Record<string, string> = {
  user: "user",
  manager: "manager",
  tenant: "tenant",
  location: "location",
  property: "property",
  lease: "lease",
  application: "application",
  payment: "payment",
};

async function resetSequence(fileBaseName: string) {
  if (STRING_PK_MODELS.has(fileBaseName)) return; // string PKs — no sequence

  const tableName = TABLE_NAME_MAP[fileBaseName] ?? fileBaseName;
  const modelNameCamel = toCamelCase(toPascalCase(fileBaseName));
  const model = (prisma as any)[modelNameCamel];

  const maxIdResult = await model.findMany({
    select: { id: true },
    orderBy: { id: "desc" },
    take: 1,
  });

  if (maxIdResult.length === 0) return;

  const nextId = maxIdResult[0].id + 1;

  // Use the lowercase @@map table name in quotes so Postgres finds the sequence.
  await prisma.$executeRaw(
    Prisma.raw(
      `SELECT setval(pg_get_serial_sequence('"${tableName}"', 'id'), ${nextId}, false)`,
    ),
  );

  console.log(`  ↳ Reset sequence for "${tableName}" → next id = ${nextId}`);
}

// ─── Delete all data ──────────────────────────────────────────────────────────

async function deleteAllData(orderedFileNames: string[]) {
  // Reverse order to satisfy FK constraints
  const reversed = [...orderedFileNames].reverse();

  for (const fileName of reversed) {
    const fileBaseName = path.basename(fileName, path.extname(fileName));

    // Skip better-auth managed tables — they are handled by better-auth itself
    if (STRING_PK_MODELS.has(fileBaseName)) {
      console.log(`  ⚠  Skipping clear for better-auth table: ${fileBaseName}`);
      continue;
    }

    const modelNameCamel = toCamelCase(toPascalCase(fileBaseName));
    const model = (prisma as any)[modelNameCamel];

    if (!model) {
      console.error(`  ✗ Model "${fileBaseName}" not found in Prisma client`);
      continue;
    }

    try {
      await model.deleteMany({});
      console.log(`  ✓ Cleared: ${fileBaseName}`);
    } catch (error) {
      console.error(`  ✗ Error clearing ${fileBaseName}:`, error);
    }
  }
}

// ─── Specialised seeders ──────────────────────────────────────────────────────

/**
 * Seed the better-auth `user` table directly.
 * In production, users are created by better-auth at sign-up.
 * For dev seeds we insert stub rows so Manager / Tenant FK constraints are met.
 */
async function seedUsers(users: any[]) {
  for (const user of users) {
    try {
      await prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified ?? false,
          image: user.image ?? null,
          role: user.role ?? null,
          banned: user.banned ?? false,
          banReason: user.banReason ?? null,
          banExpires: user.banExpires ? new Date(user.banExpires) : null,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        },
      });
    } catch (error) {
      console.error(`  ✗ Error upserting user ${user.email}:`, error);
    }
  }
  console.log(`  ✓ Seeded ${users.length} users`);
}

/**
 * Seed Tenant rows. The original data embeds Prisma `connect` syntax for
 * the many-to-many relations (properties, favorites) — we extract those
 * and pass them through directly to prisma.tenant.create().
 */
async function seedTenants(tenants: any[]) {
  for (const tenant of tenants) {
    const { properties, favorites, ...scalarFields } = tenant;

    try {
      await prisma.tenant.create({
        data: {
          ...scalarFields,
          ...(properties ? { properties } : {}),
          ...(favorites ? { favorites } : {}),
        },
      });
    } catch (error) {
      console.error(`  ✗ Error seeding tenant ${tenant.email}:`, error);
    }
  }
  console.log(`  ✓ Seeded ${tenants.length} tenants`);
}

/**
 * Seed Payment rows. The original tutorial used nested `lease.connect` syntax;
 * we flatten that to a plain `leaseId` scalar since our JSON already stores it
 * that way.
 */
async function seedPayments(payments: any[]) {
  for (const payment of payments) {
    try {
      await prisma.payment.create({
        data: {
          amountDue: payment.amountDue,
          amountPaid: payment.amountPaid,
          dueDate: new Date(payment.dueDate),
          paymentDate: payment.paymentDate
            ? new Date(payment.paymentDate)
            : null,
          paymentStatus: payment.paymentStatus,
          leaseId: payment.leaseId,
        },
      });
    } catch (error) {
      console.error(
        `  ✗ Error seeding payment for lease ${payment.leaseId}:`,
        error,
      );
    }
  }
  console.log(`  ✓ Seeded ${payments.length} payments`);
}

// ─── Generic seeder ───────────────────────────────────────────────────────────

async function seedGeneric(modelNameCamel: string, items: any[]) {
  const model = (prisma as any)[modelNameCamel];
  for (const item of items) {
    try {
      await model.create({ data: item });
    } catch (error) {
      console.error(`  ✗ Error seeding ${modelNameCamel}:`, error);
    }
  }
  console.log(`  ✓ Seeded ${items.length} ${modelNameCamel} rows`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const dataDirectory = path.join(__dirname, "seedData");

  /**
   * Insertion order matters for FK constraints:
   *   user → manager / tenant
   *   location → property
   *   property + tenant → lease → payment
   *   property + tenant → application (references lease)
   */
  const orderedFileNames = [
    "user.json", // better-auth stub users (managers + tenants)
    "location.json", // no FK dependencies
    "manager.json", // depends on user
    "property.json", // depends on location + manager
    "tenant.json", // depends on user + property (M2M connect)
    "lease.json", // depends on property + tenant
    "application.json", // depends on property + tenant + lease
    "payment.json", // depends on lease
  ];

  console.log("\n🗑  Clearing existing data...");
  await deleteAllData(orderedFileNames);

  console.log("\n🌱 Seeding data...\n");

  for (const fileName of orderedFileNames) {
    const filePath = path.join(dataDirectory, fileName);
    const jsonData: any[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const fileBaseName = path.basename(fileName, path.extname(fileName));
    const modelNameCamel = toCamelCase(toPascalCase(fileBaseName));

    console.log(`→ ${fileName}`);

    switch (fileBaseName) {
      case "user":
        await seedUsers(jsonData);
        // No integer sequence to reset for User
        break;

      case "tenant":
        await seedTenants(jsonData);
        await resetSequence(fileBaseName);
        break;

      case "payment":
        await seedPayments(jsonData);
        await resetSequence(fileBaseName);
        break;

      default:
        await seedGeneric(modelNameCamel, jsonData);
        await resetSequence(fileBaseName);
        break;
    }

    await sleep(300); // brief pause between models
  }

  console.log("\n✅ Seeding complete.\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
