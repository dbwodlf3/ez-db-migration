import { MigrationMapper } from "./migration";
import { printPrettyJson, Schema } from "./parser";

export interface MigrationAST {
  meta: {
    tableName: string;
  };
  originMeta: {
    tableName: string;
  };
  columns: {
    [key: string]: {
      type: string;
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
      [key: string]: any;
    };
  };
}

export function makeMigrationAST(input: {
  tables: { tableName: string; columns: Schema[] }[];
  mappers: MigrationMapper[];
}): MigrationAST[] {
  const tables = input.tables;
  const queries = [];
  const result = [];

  for (const table of tables) {
    const mappers = input.mappers.filter(
      (x) => x.originMeta.tableName == table.tableName
    );

    for (const mapper of mappers) {
      const tableQueries: any = {};
      for (const column of table.columns) {
        const columnName = column.columnName;
        const queryObj = {
          column: column.columnName,
          type: column.type,
          valueOption: column.valueOption,
          typeOption: column.typeOption,
          columnOption: column.columnOption,
        };
        if (!mapper.columns) {
          continue;
        } else if (!mapper.columns[columnName]) {
          continue;
        } else if (mapper.columns[columnName]) {
          const mapper_column = mapper.columns[columnName];

          if (mapper_column.column) queryObj.column = mapper_column.column;
        }
        tableQueries[columnName] = queryObj;
      }
      result.push({
        meta: {
          tableName: mapper.tableName,
        },
        originMeta: mapper.originMeta,
        columns: tableQueries,
      });
    }
  }

  return result;
}

export function makerCreateTableQuery(input: MigrationAST[]) {
  const asts = input;
  const queries: string[] = [];

  //   CREATE TABLE `Users_State` (
  //     `userId` INT NOT NULL,
  //     `isBlocked` TINYINT NOT NULL,
  //     `isActive` TINYINT NOT NULL,
  //     `isEmailVerified` TINYINT NOT NULL,
  //     PRIMARY KEY (`userId`)
  // );

  for (const ast of asts) {
    const columns: string[] = [];
    const column_queries: string[] = [];

    for (const column of Object.keys(ast.columns)) {
      if (ast.columns && ast.columns[column]) {
        const _columnName = ast.columns[column].column || column;
        const _typeName = (() => {
          const tokens = [];
          tokens.push(ast.columns[column].type.toUpperCase());
          tokens.push(ast.columns[column].valueOption);
          return tokens.join("");
        })();
        const _typeOption = (() => {
          const tokens: string[] = [];
          // ast.columns[column].typeOption;
          return tokens.join(" ");
        })();
        const _columnOption = (() => {
          const tokens: string[] = [];
          if (ast.columns[column].columnOption?.primaryKey) {
            tokens.push("PRIMARY KEY");
          }
          if (ast.columns[column].columnOption?.default) {
            tokens.push(`DEFAULT ${ast.columns[column].columnOption?.default}`);
          }
          if (ast.columns[column].columnOption?.auto_increment) {
            tokens.push(`DEFAULT AUTO_INCREMENT`);
          }

          return tokens.join(" ");
        })();

        const query = `${_columnName} ${_typeName}${_typeOption} ${_columnOption}`;
        column_queries.push(query);
      }
    }

    // prettier-ignore
    queries.push(`CREATE TABLE ${ast.meta.tableName} (\n\t${column_queries.join(",\n\t")}\n)`);
  }

  return queries;
}

export function makeInsertQuery(input: MigrationAST[]) {}
