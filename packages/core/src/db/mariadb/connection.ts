import mariadb from "mariadb";
import {
  MariaDBConnectionConfiguration,
  MariadbSchema,
} from "./connection/type";

export type MariadbSchemaMap = { [key: string]: MariadbSchema[] };

export async function getConnection(conf: MariaDBConnectionConfiguration) {
  const connection = await mariadb.createConnection({
    user: conf.user,
    password: conf.password,
    host: conf.host,
    port: conf.port,
    database: conf.database,
  });

  return connection;
}

export async function getDatabaseSchemas(connection: mariadb.Connection) {
  const tables = (await connection.query("SHOW TABLES")) as {
    [key: string]: string;
  }[];

  const tableNames: string[] = [];

  for (const table of tables) {
    const tableName = Object.values(table)[0];
    tableNames.push(tableName);
  }

  const tableSchemas = [];

  for (const tableName of tableNames) {
    const tableSchema = await connection.query(`DESCRIBE ${tableName}`);
    tableSchemas.push(tableSchema);
  }

  const tableSchemaMap = {} as any;

  for (let i = 0; i < tableNames.length; i++) {
    tableSchemaMap[tableNames[i]] = tableSchemas[i];
  }

  return tableSchemaMap as MariadbSchemaMap;
}
