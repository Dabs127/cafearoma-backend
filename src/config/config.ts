import dotenv from "dotenv";

dotenv.config();

interface Config {
  nodeEnv: string;
  PORT: number;
}

const config: Config = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  PORT: parseInt(process.env.PORT ?? "3002", 10),
};

export default config;
// This is a configuration file that loads environment variables from a .env file
// and exports a config object with the PORT and nodeEnv properties.
// The PORT property is parsed as an integer, defaulting to 3000 if not set.
// The nodeEnv property is set to the value of the NODE_ENV environment variable,
// defaulting to 'development' if not set.
