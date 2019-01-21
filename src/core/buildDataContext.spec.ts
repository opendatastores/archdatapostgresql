import { expect } from "chai";
import { IPostgreSQLDataConfig } from "../IPostgreSQLDataConfig";
import { buildDataContext } from "./buildDataContext";

describe("buildDataContext.ts tests", () => {
  const testConfig: IPostgreSQLDataConfig = {
    database: "test",
    host: "localhost",
    password: "postgres",
    port: 5432,
    user: "postgres",
  };

  const testItem: any = {
    _id: undefined,
    date: new Date(),
  };

  const dataContext = buildDataContext(testConfig);

  after(() => dataContext.close());

  describe("#DataContext", () => {
    before(async () => {
      const db = await dataContext.db();
      const sql = `CREATE TABLE sample (
        "_id" varchar NULL,
        "date" timestamp NULL,
        CONSTRAINT sample_pk PRIMARY KEY ("_id")
      );`;
      await db.query(sql);
    });

    after(async () => {
      const db = await dataContext.db();
      const sql = "DROP TABLE sample";
      await db.query(sql);
    });

    describe("#DataContext.db()", () => {
      it("expect to resolve the database instance, #1", async () => {
        // arranges

        // acts
        const db = await dataContext.db();

        // asserts
        expect(db).not.to.equal(null);
        expect(db).not.to.equal(undefined);
      });

      it("expect to resolve the database instance, #2", async () => {
        // arranges

        // acts
        const db1 = await dataContext.db();
        const db2 = await dataContext.db();

        // asserts
        expect(db1).to.equal(db2);
      });
    });

    describe("#DataContext.newID()", () => {
      it("expect to create a new ID", () => {
        // arranges

        // acts
        const id = dataContext.newID();
        testItem._id = id;

        // asserts
        expect(id).not.to.equal(null);
        expect(id).not.to.equal(undefined);
      });
    });

    describe("#DataContext.createItem()", () => {
      it("expect to create a new item", async () => {
        // arranges
        const expected = {
          affected: 1,
        };

        // acts
        const result = await dataContext.createItem("sample", testItem);

        // asserts
        expect(result).to.deep.equal(expected);
      });
    });

    describe("#DataContext.queryItem()", () => {
      it("expect to query an item by id", async () => {
        // arranges

        // acts
        const result = await dataContext.queryItem("sample", testItem._id);

        // asserts
        expect(result).to.deep.equal(testItem);
      });

      it("expect to get undefined if the id not exist", async () => {
        // arranges

        // acts
        const result = await dataContext.queryItem("sample", "11111");

        // asserts
        expect(result).to.equal(undefined);
      });
    });

    describe("#DataContext.removeItem()", () => {
      it("expect to remove an item by id", async () => {
        // arranges
        const expected = {
          affected: 1,
        };

        // acts
        const result = await dataContext.removeItem("sample", testItem._id);

        // asserts
        expect(result).to.deep.equal(expected);
      });

      it("expect to remove none when the id not exist", async () => {
        // arranges
        const id = dataContext.newID();
        const expected = {
          affected: 0,
        };

        // acts
        const result = await dataContext.removeItem("sample", id);

        // asserts
        expect(result).to.deep.equal(expected);
      });
    });

    describe("#DataContext.toRepository", () => {
      it("expect to resolve a repository", () => {
        // arranges

        // acts
        const result = dataContext.toRepository("sample");

        // asserts
        expect(result).not.to.equal(null);
        expect(result).not.to.equal(undefined);
      });
    });
  });

  describe("#Repository", () => {
    const repository = dataContext.toRepository("sample");

    before(async () => {
      const db = await dataContext.db();
      const sql = `CREATE TABLE sample (
        "_id" varchar NULL,
        "date" timestamp NULL,
        CONSTRAINT sample_pk PRIMARY KEY ("_id")
      );`;
      await db.query(sql);
    });

    after(async () => {
      const db = await dataContext.db();
      const sql = "DROP TABLE sample";
      await db.query(sql);
    });

    describe("#Repository.collection()", () => {
      it("expect to resolve the collection instance", async () => {
        // arranges

        // acts
        const collection = await repository.collection();

        // asserts
        expect(collection).not.to.equal(null);
        expect(collection).not.to.equal(undefined);
      });
    });

    describe("#Repository.newID()", () => {
      it("expect to create a new ID", () => {
        // arranges

        // acts
        const id = repository.newID();
        testItem._id = id;

        // asserts
        expect(id).not.to.equal(null);
        expect(id).not.to.equal(undefined);
      });
    });

    describe("#Repository.createItem()", () => {
      it("expect to create a new item", async () => {
        // arranges
        const expected = {
          affected: 1,
        };

        // acts
        const result = await repository.createItem(testItem);

        // asserts
        expect(result).to.deep.equal(expected);
      });
    });

    describe("#Repository.queryItem()", () => {
      it("expect to query an item by id", async () => {
        // arranges

        // acts
        const result = await repository.queryItem(testItem._id);

        // asserts
        expect(result).to.deep.equal(testItem);
      });
    });

    describe("#Repository.removeItem()", () => {
      it("expect to remove an item by id", async () => {
        // arranges
        const expected = {
          affected: 1,
        };

        // acts
        const result = await repository.removeItem(testItem._id);

        // asserts
        expect(result).to.deep.equal(expected);
      });

      it("expect to remove none when the id not exist", async () => {
        // arranges
        const id = repository.newID();
        const expected = {
          affected: 0,
        };

        // acts
        const result = await repository.removeItem(id);

        // asserts
        expect(result).to.deep.equal(expected);
      });
    });
  });
});
