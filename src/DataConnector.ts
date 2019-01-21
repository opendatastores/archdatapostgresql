import { IDataConnector } from "archdatacore";
import { buildDataContext } from "./core/buildDataContext";
import { IPostgreSQLDataConfig } from "./IPostgreSQLDataConfig";

export const DataConnector: IDataConnector = (config: IPostgreSQLDataConfig) => () => buildDataContext(config);

Object.freeze(DataConnector);
