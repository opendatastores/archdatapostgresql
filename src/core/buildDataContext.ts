import { IDataContext } from "archdatacore";
import * as uuid from "uuid";
import { IPostgreSQLDataConfig } from "../IPostgreSQLDataConfig";
import { IPostgreSQLOptions } from "../IPostgreSQLOptions";
import { DBClient } from "./DBClient";
import { SQLParser } from "./SQLParser";

export const buildDataContext = (config: IPostgreSQLDataConfig): IDataContext =>
  ((Config: IPostgreSQLDataConfig): IDataContext => {
    const client = DBClient.create(Config);

    const dataContext: IDataContext = {
      close: () => client.end(),
      createItem: async (collection, item, options = {}) => {
        const { text, values } = SQLParser.insertObject(collection, item, options);
        const result = await client.query(text, values);

        return { affected: result.rowCount };
      },
      db: () => Promise.resolve(client),
      newID: () => uuid.v4(),
      queryByID: async (collection, id, options = {}) => {
        const { text, values } = SQLParser.queryByID(collection, id, options);
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
        const result = await client.query(text, values);

        return { affected: result.rowCount };
      },
      toRepository: (collection, defaultOptions = {}) => ({
        collection: () =>
          Promise.resolve(client),
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
