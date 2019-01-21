import { IDataContext } from "archdatacore";
import * as uuid from "uuid";
import { IPostgreSQLDataConfig } from "../IPostgreSQLDataConfig";
import { DBClient } from "./DBClient";
import { SQLParser } from "./SQLParser";

export const buildDataContext = (config: IPostgreSQLDataConfig): IDataContext =>
  ((Config: IPostgreSQLDataConfig): IDataContext => {
    const client = DBClient.create(Config);

    const dataContext: IDataContext = {
      close: () => client.end(),
      createItem: async (collection, item, options) => {
        const { text, values } = SQLParser.insertObject(collection, item, options);
        const result = await client.query(text, values);

        return { affected: result.rowCount };
      },
      db: () => Promise.resolve(client),
      newID: () => uuid.v4(),
      queryItem: async (collection, id, options) => {
        const { text, values } = SQLParser.queryByID(collection, id, options);
        const { rows } = await client.query(text, values);

        return rows.length > 0 ? rows[0] : undefined;
      },
      removeItem: async (collection, id, options) => {
        const { text, values } = SQLParser.removeByID(collection, id, options);
        const result = await client.query(text, values);

        return { affected: result.rowCount };
      },
      toRepository: (collection) => ({
        collection: () => Promise.resolve(client),
        createItem: (item, options) => dataContext.createItem(collection, item, options),
        newID: () => dataContext.newID(),
        queryItem: (id, options) => dataContext.queryItem(collection, id, options),
        removeItem: (id, options) => dataContext.removeItem(collection, id, options),
      }),
    };

    return dataContext;
  })(config);

Object.freeze(buildDataContext);
