import { ColumnDataTypes } from "../domain/type";
import { ParsedColumnTypeOption } from "../parser/type";

interface ColumnMapper {
  column?: string;
  type?: (typeof ColumnDataTypes)[number];
  typeOption?: ParsedColumnTypeOption;
  columnOption?: any;
}

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

export interface MigrationMapper {
  originMeta: { tableName: string };
  tableName: string;
  columns?: {
    [key: string]: ColumnMapper;
  };
}

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
