import * as uuid from "uuid";
import { IPostgreSQLConnectorConfig } from "../IPostgreSQLConnectorConfig";
import { IPostgreSQLDataContext } from "../IPostgreSQLDataContext";
import { IPostgreSQLOptions } from "../IPostgreSQLOptions";
import { createDBAdmin } from "./connection/createDBAdmin";
import { createDBClientPool } from "./connection/createDBClientPool";
import { SQLParser } from "./SQLParser";

export const buildDataContext = (config: IPostgreSQLConnectorConfig): IPostgreSQLDataContext =>
  ((Config: IPostgreSQLConnectorConfig): IPostgreSQLDataContext => {
    const adminProxy = createDBAdmin(Config);
    const clientPoolProxy = createDBClientPool(Config);

    const dataContext: IPostgreSQLDataContext = {
      admin: async () => adminProxy.get(),
      adminQueries: {
        createDB: async (dbName) => {
          const admin = await adminProxy.get();
          const sql = `CREATE DATABASE ${dbName};`;

          await admin.query(sql);
        },
        dropDB: async (dbName) => {
          const admin = await adminProxy.get();
          const sql = `DROP DATABASE ${dbName};`;

          await admin.query(sql);
        },
      },
      close: async (mode: "all" | "client" | "admin" = "all") => {
        const ps: any[] = [];

        if (mode === "all" || mode === "admin") {
          ps.push(adminProxy.end());
        }

        if (mode === "all" || mode === "client") {
          ps.push(clientPoolProxy.end());
        }

        await Promise.all(ps);
      },
      createItem: async (collection, item, options = {}) => {
        const { text, values } = SQLParser.insertObject(collection, item, options);
        const client = clientPoolProxy.get();
        const result = await client.query(text, values);

        return { affected: result.rowCount };
      },
      db: async () => clientPoolProxy.get(),
      newID: () => {
        if (Config.newIDFunc === undefined) {
          return uuid.v4();
        } else {
          return Config.newIDFunc();
        }
      },
      queryByID: async (collection, id, options = {}) => {
        const { text, values } = SQLParser.queryByID(collection, id, options);
        const client = clientPoolProxy.get();
        const { rows } = await client.query(text, values);
        const item = rows.length > 0 ? rows[0] : undefined;

        if (item === undefined) {
          return undefined;
        } else {
          const { queryParser = (o: any) => o } = options as IPostgreSQLOptions;

          return queryParser(item);
        }
      },
      removeByID: async (collection, id, options = {}) => {
        const { text, values } = SQLParser.removeByID(collection, id, options);
        const client = clientPoolProxy.get();
        const result = await client.query(text, values);

        return { affected: result.rowCount };
      },
      toRepository: (collection, defaultOptions = {}) => ({
        collection: async () => clientPoolProxy.get(),
        createItem: (item, options = {}) =>
          dataContext.createItem(collection, item, Object.assign(options, defaultOptions)),
        newID: () =>
          dataContext.newID(),
        queryByID: (id, options = {}) =>
          dataContext.queryByID(collection, id, Object.assign(options, defaultOptions)),
        removeByID: (id, options = {}) =>
          dataContext.removeByID(collection, id, Object.assign(options, defaultOptions)),
      }),
    };

    return dataContext;
  })(config);

Object.freeze(buildDataContext);
