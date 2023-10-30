import { MariadbSchema } from "../connection/type";
import { ColumnDataTypes } from "../domain/type";

export interface ParsedColumnTypeOption {
  unsigned?: boolean;
  [key: string]: any;
}

export interface ParsedSchema {
  columnName: string;
  type: (typeof ColumnDataTypes)[number];
  valueOption?: string;
  typeOption?: ParsedColumnTypeOption;
  columnOption?: {
    primaryKey?: boolean;
    default?: any;
    auto_increment?: boolean;
    [key: string]: any;
  };
}

export interface ParsedDatabase {
  Database: String;
  Table: String;
  Schema: MariadbSchema;
}
