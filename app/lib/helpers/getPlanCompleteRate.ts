import { Connection, RowDataPacket } from "mysql2";

export async function getPlanCompletRate(
  connection: Connection,
  plant: string,
  linecode: string,
  startdate: string,
  enddate: string
) {
  const sql = `
    select
        EST as date,
        cast(sum(Quantity) as SIGNED) as plan_qty 
    from
        cosmo_im_${plant}.base_production_order_t bpot
    where
        bpot.Production_Line_Code = '${linecode}'
        and EST >= '${startdate}' and bpot.EST <= '${enddate}'
    group by
        est;
`;

  return connection.query<RowDataPacket[]>(sql);
}

export async function getOfflineCompleteRate(
  connection: Connection,
  plant: string,
  linecode: string,
  startdate: string,
  enddate: string
) {
  const sql = `
            select
                date(ScanTime) as date,
                cast(count(WorkUser_BarCode)as SIGNED) as 'act_qty'
            from
                cosmo_im_${plant}.bns_pm_scanhistory_month bpsm
            where
                date(ScanTime) >= '${startdate}' and date(ScanTime) <= '${enddate}'
                and bpsm.Production_Line_Code = '${linecode}'
                and Type = 1
            group by
                date(ScanTime);
    `;

  return connection.query<RowDataPacket[]>(sql);
}
