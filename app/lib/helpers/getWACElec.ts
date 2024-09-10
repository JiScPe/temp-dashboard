import { Connection, RowDataPacket } from "mysql2";

export async function getWACElec(
  connection: Connection,
  startdate: string,
  enddate: string
) {
  const sql = `SELECT
              f_date,
              SUM(IF(RIGHT(F_EqmIP, 3) = '204', COALESCE(ceil(f_consumption), 0), 0)) AS 'wac_line1',
              SUM(IF(RIGHT(F_EqmIP, 3) = '205', COALESCE(ceil(f_consumption), 0), 0)) AS 'wac_line2'
            FROM
              elec_consumption t1
            WHERE
              F_Date >= '${startdate}'
              AND F_Date <= '${enddate}'
              AND F_Time = (
                  SELECT
                      MAX(F_Time)
                  FROM
                      elec_consumption t2
                  WHERE
                      t1.F_Date = t2.F_Date
                      AND t1.F_EqmIP = t2.F_EqmIP
              )
            GROUP BY
              F_Date
            ORDER BY
              F_Date;
              `;

  return connection.query<RowDataPacket[]>(sql);
}
