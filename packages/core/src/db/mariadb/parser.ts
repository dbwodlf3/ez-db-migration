import { MariadbSchema, MariadbSchemaMap } from "../../db/mariadb/connection";

export const DataType = [
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

export interface Schema {
  columnName: string;
  type: (typeof DataType)[number];
  valueOption?: string;
  typeOption?: {
    unsigned?: boolean;
    [key: string]: any;
  };
  columnOption?: {
    primaryKey?: boolean;
    default?: any;
    auto_increment?: boolean;
    [key: string]: any;
  };
}

export interface RDBData {
  Database: String;
  Table: String;
  Schema: MariadbSchema;
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
        columnName: field.Field,
        type: _parsedType.type,
        valueOption: _parsedType.valueOption,
        typeOption: _parsedType.typeOption,
        columnOption: _parsedColumnOption,
      };

      parsedColumns.push(parsedResult);
    }

    const tableName = tableNames.shift()!;

    result.push({ tableName: tableName, columns: parsedColumns });
    parsedColumns = [];
  }

  return result;
}

/**
 * """
 * `id` ${type} PRIMARY KEY AUTO_INCREMENT
 * """
 */
function parseType(inputString: string) {
  const typeRegex = /^([^\s]*)(.*)/;
  const result = typeRegex.exec(inputString);

  if (!result) {
    throw new Error(`Can't parse a column ${inputString}`);
  }

  let temp;
  let type = result[1];
  let dataValueOption;
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
    dataValueOption = temp[1].slice(0, -1);
  } else if (temp.length > 1) {
    throw new Error(`Can't parse a column ${inputString}`);
  }

  if (!DataType.includes(type as (typeof DataType)[number])) {
    throw new Error(`Undefined column type ${inputString}`);
  }

  return {
    type: type as (typeof DataType)[number],
    valueOption: dataValueOption ? `(${dataValueOption})` : "",
    typeOption: {
      ...options,
    },
  };
}

/**
 * """
 * `id` INT UNSIGNED ${ColumnOption}
 * """
 */
function parseColumnOption(input: MariadbSchema) {
  let result: any = {};
  if (input.Key == "PRI") {
    result.primaryKey = true;
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
  const output = JSON.stringify(inputJson, null, 2)
    .replace(/\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .trim();
  console.log(output);
}
