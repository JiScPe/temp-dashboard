import moment from "moment";
import { Connection, RowDataPacket } from "mysql2/promise";

export async function createWhitelist(
  conn: Connection,
  id: string,
  requestor: string,
  material: string,
  reason: string
) {
  const created_at: string = moment().format("YYYY-MM-DD HH:mm:ss");
  const updated_at: string = moment().format("YYYY-MM-DD HH:mm:ss");
  const sql = `insert into gmdc_whitelist_req (id, requestor, material, reason, created_at, updated_at) values ('${id}', '${requestor}', '${material}', '${reason
    .replace(",", ".")
    .replace("'", "\\'")}', '${created_at}', '${updated_at}')`;
  return conn.query<RowDataPacket[]>(sql);
}

export async function getOneWhitelistReq(conn: Connection, id: string) {
  const sql = `select * from gmdc_whitelist_req where id = '${id}'`;

  return conn.query<RowDataPacket[]>(sql);
}

export async function getAllWhitelistReq(conn: Connection) {
  const sql = "select * from gmdc_whitelist_req";

  return conn.query<RowDataPacket[]>(sql);
}

export async function updateWhitelistReq(
  conn: Connection,
  id: string,
  updateData: { status: string; updated_at: string }
) {
  const { status, updated_at } = updateData;
  const sql = `update gmdc_whitelist_req set status = '${status}', updated_at = '${updated_at}' where id = '${id}'`;

  return conn.query<RowDataPacket[]>(sql);
}

export async function deleteWhitelistReq(conn: Connection, id: string) {
  const sql = `delete from gmdc_whitelist_req where id = ${id}`;
  return conn.query<RowDataPacket[]>(sql);
}
