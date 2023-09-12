import { mariadbParse, printPrettyJson } from "../../parse";
import { getConnection, getDatabaseSchemas } from "../../mariadb-connection";

describe("Connection test", () => {
  it("should get data from connection", async () => {
    const connection = await getConnection({
      host: "0.0.0.0",
      port: 3306,
      user: "root",
      password: "test",
      database: "test",
    });

    const schemaMap = await getDatabaseSchemas(connection);
    const parsedResult = mariadbParse(schemaMap);

    printPrettyJson(parsedResult);

    await connection.end();
  });
});
