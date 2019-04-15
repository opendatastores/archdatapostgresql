import {
  Pool,
  PoolClient,
  PoolConfig,
} from "pg";
import { IPostgreSQLConnectorConfig } from "../../IPostgreSQLConnectorConfig";
import { IEndableClient } from "./IEndableClient";

export interface IDBClientPool extends IEndableClient {
  connect: () => Promise<PoolClient>;
  get: () => Pool;
}

const poolConfig = (config: IPostgreSQLConnectorConfig): PoolConfig => {
  const result: PoolConfig = {};

  if (config.connectionString) {
    result.connectionString = config.connectionString;
  } else {
    const { database, host, password, port, user = "" } = config;

    result.database = database;
    result.host = host;
    result.password = password;
    result.port = port || 5432;
    result.user = user;
  }

  return result;
};

export const createDBClientPool = (config: IPostgreSQLConnectorConfig): IDBClientPool => ((
  Config,
): IDBClientPool => {
  let PoolInstance: Pool | undefined;

  const resolveInstance = () => {
    if (PoolInstance === undefined) {
      PoolInstance = new Pool(poolConfig(Config));
    }

    return PoolInstance;
  };

  const connect = async () => resolveInstance().connect();
  const end = async () => {
    if (PoolInstance !== undefined) {
      await PoolInstance.end();

      PoolInstance = undefined;
    }
  };
  const get = () => resolveInstance();

  return {
    connect,
    end,
    get,
  };
})(config);
