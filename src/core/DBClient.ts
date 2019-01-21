import { Pool } from "pg";
import { IPostgreSQLDataConfig } from "../IPostgreSQLDataConfig";

const defaultConfig = {
  port: 5432,
};

export const DBClient = {
  create: (config: IPostgreSQLDataConfig) => {
    const { host, port, database, user, password } = config;
    const Config = Object.assign(defaultConfig, {
      database,
      host,
      password,
      port,
      user,
    });
    const client = new Pool(Config);

    return client;
  },
};
