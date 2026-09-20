import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";

// Load from single root .env file if available, falling back to local .env
const rootEnvPath = path.resolve(process.cwd(), "..", ".env");
const currentEnvPath = path.resolve(process.cwd(), ".env");

if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
}
if (fs.existsSync(currentEnvPath)) {
  dotenv.config({ path: currentEnvPath });
}
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  MYSQL_HOST: process.env.MYSQL_HOST || "localhost",
  MYSQL_PORT: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT, 10) : 3306,
  MYSQL_DATABASE: process.env.MYSQL_DATABASE || "portfolio_db",
  MYSQL_USER: process.env.MYSQL_USER || "root",
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || "",
  JWT_SECRET: process.env.JWT_SECRET || "default_jwt_secret_key_123456789",
  RESEND_API_KEY: process.env.RESEND_API_KEY || "",
  OWNER_EMAIL: process.env.OWNER_EMAIL || "abhijitskv3@gmail.com",
};
