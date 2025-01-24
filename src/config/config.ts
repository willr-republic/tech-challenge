import "dotenv/config";

import process from "node:process";

import { Config } from "./config.interface";

const ENV = process.env;

export const config: Config = {
  postgres: {
    databaseUrL: ENV.DATABASE_URL!,
  },
};
