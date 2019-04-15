import { expect } from "chai";
import { DataConnector } from "./DataConnector";
import { IPostgreSQLConnectorConfig } from "./IPostgreSQLConnectorConfig";

describe("DataConnector.ts tests", () => {
  const config: IPostgreSQLConnectorConfig = {
    database: "test",
    host: "localhost",
    password: "postgres",
    user: "postgres",
  };

  describe("#DataConnector()", () => {
    it("expect to build the data context without throwing exceptions", () => {
      // arranges

      // acts
      const connect = DataConnector(config);
      const result = connect();

      // asserts
      expect(result).not.to.equal(null);
      expect(result).not.to.equal(undefined);
    });
  });
});
