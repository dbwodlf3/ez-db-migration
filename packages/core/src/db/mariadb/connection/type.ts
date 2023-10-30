export interface MariaDBConnectionConfiguration {
  host: string;
  port: number;
  user: string;
  password?: string;
  database?: string;
}

export interface MariadbSchema {
  Field: string;
  Type: string;
  Null: "YES" | "NO";
  Key: string;
  Default: any;
  Extra: string;
}
