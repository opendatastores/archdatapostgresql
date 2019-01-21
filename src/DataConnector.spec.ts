import { expect } from "chai";
import { DataConnector } from "./DataConnector";
import { IPostgreSQLDataConfig } from "./IPostgreSQLDataConfig";

describe("DataConnector.ts tests", () => {
  const testConfig: IPostgreSQLDataConfig = {
    database: "test",
    host: "localhost",
    password: "postgres",
    user: "postgres",
  };

  describe("#DataConnector()", () => {
    it("expect to build the data context without throwing exceptions", () => {
      // arranges

      // acts
      const connect = DataConnector(testConfig);
      const result = connect();

      // asserts
      expect(result).not.to.equal(null);
      expect(result).not.to.equal(undefined);
    });
  });
});
