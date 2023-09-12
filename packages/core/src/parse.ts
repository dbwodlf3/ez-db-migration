import { MariadbSchema, MariadbSchemaMap } from "mariadb-connection";

const RDBType = [
  "bigint",
  "text",
  "varchar",
  "tinyint",
  "timestamp",
  "datetime",
  "int",
  "tinyint",
  "double",
  "boolean",
] as const;

interface Schema {
  column: string;
  type: (typeof RDBType)[number];
  typeOption?: any;
  columnOption?: any;
}

export interface RDBData {
  Database: String;
  Table: String;
  Schema: Schema[];
}

export function mariadbParse(inputSchemaMap: MariadbSchemaMap) {
  const tableNames = Object.keys(inputSchemaMap);
  const tableSchemas = Object.values(inputSchemaMap);
  const result = [];
  let parsedColumns: Schema[] = [];

  for (const tableSchema of tableSchemas) {
    for (const field of tableSchema) {
      const _parsedType = parseType(field.Type);
      const _parsedColumnOption = parseColumnOption(field);
      field.Default;
      const parsedResult: Schema = {
        column: field.Field,
        type: _parsedType.type,
        typeOption: _parsedType.typeOption,
        columnOption: _parsedColumnOption,
      };

      parsedColumns.push(parsedResult);
    }

    const tableName = tableNames.shift();

    result.push({ table: tableName, schema: parsedColumns });
    parsedColumns = [];
  }

  return result;
}

function parseType(inputString: string) {
  const typeRegex = /^([^\s]*)(.*)/;
  const result = typeRegex.exec(inputString);

  if (!result) {
    throw new Error(`Can't parse a column ${inputString}`);
  }

  let temp;
  let type = result[1];
  let dataTypeOption;
  let options = result[2]
    .split(/\s/)
    .filter((x) => {
      if (x) return x;
    })
    .map((x) => [x, 1]);
  options = Object.fromEntries(options);

  temp = type.split("(");
  type = temp[0];
  if (temp.length == 2) {
    dataTypeOption = temp[1].slice(0, -1);
  } else if (temp.length > 1) {
    throw new Error(`Can't parse a column ${inputString}`);
  }

  if (!RDBType.includes(type as (typeof RDBType)[number])) {
    throw new Error(`Undefined column type ${inputString}`);
  }

  return {
    type: type as (typeof RDBType)[number],
    typeOption: {
      valueOption: dataTypeOption,
      ...options,
    },
  };
}

function parseColumnOption(input: MariadbSchema) {
  let result: any = {};
  if (input.Key == "PRI") {
    result.primaryKey = 1;
  }
  if (input.Default || input.Default === null) {
    result.default = input.Default;
  }
  if (input.Extra) {
    let temp: any = input.Extra.split(/\s/);
    temp = temp.map((x: any) => [x, 1]);
    temp = Object.fromEntries(temp);

    result = { ...result, ...temp };
  }

  return result;
}

export function printPrettyJson(inputJson: any) {
  console.log(JSON.stringify(inputJson, null, 2));
}
