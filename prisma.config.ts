import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  generator: {
    client: {
      output: "../node_modules/.prisma/client",
    },
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
