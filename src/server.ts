import config from "#config/config.js";
import { connectDB } from "#config/db.js";

import app from "./app.js";

connectDB().catch((error: unknown) => {
  console.error("Database connection error:", error);
  process.exit(1);
});

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT.toString()}`);
  console.log(`Environmentt: ${config.nodeEnv}`);
});
