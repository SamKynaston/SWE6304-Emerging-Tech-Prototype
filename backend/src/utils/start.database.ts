import { Sequelize } from "sequelize";

const requiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

// Create a new sequelize instance using postgres, and using environment variables set by docker
export const sequelize = new Sequelize(
  requiredEnv("POSTGRES_DB"),
  requiredEnv("POSTGRES_USER"),
  requiredEnv("POSTGRES_PASSWORD"),
  {
    host: process.env.DB_HOST ?? "db",
    port: Number(process.env.DB_PORT ?? 5432),
    dialect: "postgres",
    logging: false,
  },
);