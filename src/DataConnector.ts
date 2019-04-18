import { IDataConnector } from "archdatacore";
import { buildDataContext } from "./core/buildDataContext";
import { IPostgreSQLConnectorConfig } from "./IPostgreSQLConnectorConfig";

export const DataConnector: IDataConnector = (connectorConfig: IPostgreSQLConnectorConfig) =>
  () => buildDataContext(connectorConfig);

Object.freeze(DataConnector);
