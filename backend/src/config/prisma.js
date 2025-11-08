// src/config/prisma.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"], // helpful for debugging real DB activity
});

export default prisma;
