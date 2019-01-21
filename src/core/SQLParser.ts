export const SQLParser = {
  insertObject: (collection: string, obj: object, options?: any) => {
    const { columns, orders, values } = SQLParser.parseFromObject(obj);

    return {
      text: `INSERT INTO ${collection}(${columns}) VALUES(${orders}) RETURNING *`,
      values,
    };
  },
  parseFromObject: (obj: object) => {
    const keys = Object.keys(obj);

    return {
      columns: keys.join(","),
      orders: keys.map((each, index) => `$${index + 1}`).join(","),
      values: keys.map((each) => obj[each]),
    };
  },
  queryByID: (collection: string, id: string, options?: any) => {
    return {
      text: `SELECT * FROM ${collection} WHERE _id = $1`,
      values: [id],
    };
  },
  removeByID: (collection: string, id: string, options?: any) => {
    return {
      text: `DELETE FROM ${collection} WHERE _id = $1`,
      values: [id],
    };
  },
};
