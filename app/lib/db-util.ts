import mysql, { Connection } from "mysql2/promise";

export async function connectWMS9771Database(): Promise<Connection> {
  const {
    MYSQL_WMS_HOST,
    MYSQL_WMS_9771_DATABASE,
    MYSQL_WMS_USERNAME,
    MYSQL_WMS_PASSWORD,
  } = process.env;

  return await mysql.createConnection({
    host: MYSQL_WMS_HOST,
    database: MYSQL_WMS_9771_DATABASE,
    user: MYSQL_WMS_USERNAME,
    password: MYSQL_WMS_PASSWORD,
  });
}

export async function connect78database(): Promise<Connection> {
  const {
    MYSQL_78_HOST,
    MYSQL_78_DATABASE,
    MYSQL_78_USERNAME,
    MYSQL_78_PASSWORD,
  } = process.env;

  return await mysql.createConnection({
    host: MYSQL_78_HOST,
    database: MYSQL_78_DATABASE,
    user: MYSQL_78_USERNAME,
    password: MYSQL_78_PASSWORD,
  });
}
export async function connect78webservices(): Promise<Connection> {
  const {
    MYSQL_78_HOST,
    MYSQL_78_WEBSERVICES_DB,
    MYSQL_78_USERNAME,
    MYSQL_78_PASSWORD,
  } = process.env;

  return await mysql.createConnection({
    host: MYSQL_78_HOST,
    database: MYSQL_78_WEBSERVICES_DB,
    user: MYSQL_78_USERNAME,
    password: MYSQL_78_PASSWORD,
  });
}

export async function connectMESdatabase(): Promise<Connection> {
  const {
    MYSQL_MES_HOST,
    MYSQL_MES_DATABASE,
    MYSQL_MES_USERNAME,
    MYSQL_MES_PASSWORD,
  } = process.env;

  return await mysql.createConnection({
    host: MYSQL_MES_HOST,
    database: MYSQL_MES_DATABASE,
    user: MYSQL_MES_USERNAME,
    password: MYSQL_MES_PASSWORD,
  });
}

export async function connectTestDatabase(): Promise<Connection> {
  const { MYSQL_HOST, MYSQL_DATABASE, MYSQL_USERNAME, MYSQL_PASSWORD } =
    process.env;

  return await mysql.createConnection({
    host: MYSQL_HOST,
    database: MYSQL_DATABASE,
    user: MYSQL_USERNAME,
    password: MYSQL_PASSWORD,
  });
}
