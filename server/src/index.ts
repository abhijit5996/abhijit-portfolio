import { app } from "./app.js";
import { ENV } from "./config/env.js";
import { initDatabase } from "./config/db.js";

async function main() {
  try {
    // Attempt DB schema initialization
    await initDatabase();
  } catch (err) {
    console.warn("[Database Init Warning]", (err as Error).message);
  }

  app.listen(ENV.PORT, () => {
    console.log(`====================================================`);
    console.log(`  Portfolio Express API server running on port ${ENV.PORT}`);
    console.log(`  Health Check: http://localhost:${ENV.PORT}/api/health`);
    console.log(`====================================================`);
  });
}

void main();
