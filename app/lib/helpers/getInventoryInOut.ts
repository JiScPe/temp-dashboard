import moment from "moment";
import { Connection, RowDataPacket } from "mysql2";

export async function getInventoryInOut(
  connection: Connection,
  startdate: string,
  enddate: string,
  plant: string
) {
  const sql = `
        SELECT
            date_format(CREATED_DATE, '%Y-%m-%d') as 'transaction_date',
            count(if(YD_TYPE = 'SHRK', 1, null)) as 'inbound_qty',
            count(if(YD_TYPE = 'SHRK' and add10 = 1, 1, null)) as 'inbound_qty_post_success',
            count(if(YD_TYPE = 'SHRK' and add10 = 0, 1, null)) as 'inbound_qty_post_failed',
            count(if(YD_TYPE = 'DNCK', 1, null)) as 'outbound_qty'
        FROM
            cosmo_wms_${plant}.ods_pro_storage_records_sn
        WHERE
            created_date between '${startdate}' and '${enddate}'
        GROUP BY
            date_format(CREATED_DATE, '%Y-%m-%d');
    `;

  return connection.query<RowDataPacket[]>(sql);
}
