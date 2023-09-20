// as is -> to be
// table level

import { DataType } from "db/mariadb/parser";

interface TypeOption {
  unsigned?: string;
  [key: string]: any;
}

interface ColumnOption {
  primary?: 1;
  index?: 1;
  auto_increment?: 1;
  [key: string]: any;
}

interface ColumnMapper {
  column?: string;
  type?: (typeof DataType)[number];
  typeOption?: TypeOption;
  columnOption?: any;
}

export interface MigrationMapper {
  originMeta: { tableName: string };
  tableName: string;
  columns?: {
    [key: string]: ColumnMapper;
  };
}

const mapper: MigrationMapper = {
  originMeta: {
    tableName: "user",
  },
  tableName: "Users",
  columns: {
    id: {
      type: "bigint",
    },
  },
};
