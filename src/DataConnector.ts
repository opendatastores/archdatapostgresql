import { IDataConnector } from "archdatacore";
import { buildDataContext } from "./core/buildDataContext";
import { IPostgreSQLConnectorConfig } from "./IPostgreSQLConnectorConfig";

export const DataConnector: IDataConnector = (config: IPostgreSQLConnectorConfig) => () => buildDataContext(config);

Object.freeze(DataConnector);
