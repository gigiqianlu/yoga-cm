import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Prisma CLI needs HTTPS URL for Turso; runtime uses libsql:// via adapter
    url: process.env["TURSO_MIGRATE_URL"]!,
  },
});
