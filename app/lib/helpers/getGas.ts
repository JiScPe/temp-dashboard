import { Connection, RowDataPacket } from "mysql2";

export async function getGas_Data(connection: Connection) {
  const sql = "select * from energy_n2_o2 order by readingTime desc limit 6;";

  return connection.query<RowDataPacket[]>(sql);
}
