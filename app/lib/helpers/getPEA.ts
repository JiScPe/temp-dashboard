import { Connection, RowDataPacket } from "mysql2";

export async function getPEA_Data(
  connection: Connection,
  startdate: string,
  enddate: string
) {
  const sql = `SELECT
                  DATE_FORMAT(datetime_usage, '%Y-%m-%d') AS date,
                  ROUND(
                      AVG(
                          CASE 
                              WHEN rate_a = 0 AND rate_b != 0 THEN rate_b 
                              WHEN rate_a = 0 AND rate_b = 0 THEN rate_c
                              ELSE 0
                          END
                      ), 2
                  ) AS 'usage'
              FROM energy_pea
              WHERE datetime_usage >= '${startdate} 00:00:00'
              AND datetime_usage <= '${enddate} 23:59:59'
              GROUP BY date
              ORDER BY datetime_usage;
            `;

  return connection.query<RowDataPacket[]>(sql);
}
