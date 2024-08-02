import { Connection, RowDataPacket } from "mysql2";
import { getProdLineList } from "../utility/getProdlineList";

export async function getRepair(connection: Connection, plant: string) {
  let rank_query: string | null;

  if ((plant === "9771")) {
    rank_query = `case
        when right(t.Work_Cell_Code ,
        4) = '0004' then 1
        when right(t.Work_Cell_Code,
        4) = '0007' then 2
        when right(t.Work_Cell_Code,
        4) in ('0011', '0013') then 3
        when right(t.Work_Cell_Code,
        4) = '0017' then 4
        else 0
    end as rank`;
  } else {
    rank_query = `
        case
            when right(t.Work_Cell_Code,
            4) in ('0002', '0003', '0004', '0005', '0006', 'W003', 'W004') then 1
            else 2
        end as rank`;
  }

  const sql = `
    select
        COUNT(p.WorkUser_BarCode) as input_qty,
        COUNT(case when y.RepairEndTime is not null then 1 end) as output_qty,
        COUNT(p.WorkUser_BarCode) - COUNT(case when y.RepairEndTime is not null then 1 end) as remain_qty,
        n.WorkUser_LineCode as line_code,
        t.Work_Cell_Desc as scan_station,
        ${rank_query}
    from
        cosmo_im_${plant}.bns_qm_processtestdetail de
    inner join cosmo_im_${plant}.bns_qm_processtest p use index (TestTime_index)
                on
        p.ProcessTest_ID = de.ProcessTest_ID
        and p.TestResult = 0
    left join cosmo_im_${plant}.bns_pm_operation n
                on
        p.WorkUser_BarCode = n.WorkUser_BarCode
    left join cosmo_im_${plant}.pm_Work_Cells_t t
                on
        de.Reason_Code4 = t.Work_Cell_Code
        and t.ACTIVE = '1'
    left join cosmo_im_${plant}.bns_qm_repairapply y
                on
        de.ProcessTestDetail_ID = y.ProcessTestDetail_ID
    where
        1 = 1
        and p.TestTime >= curdate()
        and n.WorkUser_LineCode in ${getProdLineList(plant)}
    group by
        n.WorkUser_LineCode,
        t.Work_Cell_Code;
    `;

  return connection.query<RowDataPacket[]>(sql);
}
