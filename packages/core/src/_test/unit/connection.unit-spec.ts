import { mariadbParse, printPrettyJson } from "../../db/mariadb/parser";
import { getConnection, getDatabaseSchemas } from "../../db/mariadb/connection";

import {
  makeMigrationAST,
  makerCreateTableQuery,
} from "../../db/mariadb/query-builder";
import { MigrationMapper } from "db/mariadb/builder/type";

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

    // printPrettyJson(schemaMap);
    // printPrettyJson(parsedResult);

    await connection.end();
  });

  it("should make migration code from migration mapper", async () => {
    const connection = await getConnection({
      host: "0.0.0.0",
      port: 3306,
      user: "root",
      password: "test",
      database: "test",
    });

    const schemaMap = await getDatabaseSchemas(connection);
    const parsedResult = mariadbParse(schemaMap);

    const userMigrationMapper: MigrationMapper = {
      originMeta: { tableName: "user" },
      tableName: "Users",
      columns: {
        id: {},
        oauth_id: { column: "oauthId" },
        oauth: {},
        email: {},
        username: {},
        password: {},
      },
    };

    const userStateMigrationMapper: MigrationMapper = {
      originMeta: { tableName: "user" },
      tableName: "Users_State",
      columns: {
        id: { column: "userId" },
        isBlocked: {},
        isActive: {},
        isEmailVerified: {},
      },
    };

    const asts = makeMigrationAST({
      tables: parsedResult,
      mappers: [userMigrationMapper, userStateMigrationMapper],
    });

    const queries = makerCreateTableQuery(asts);

    // printPrettyJson(asts);
    // printPrettyJson(queries);

    await connection.end();
  });
});
