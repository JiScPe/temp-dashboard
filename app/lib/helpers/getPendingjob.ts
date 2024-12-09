import { Connection, RowDataPacket } from "mysql2";
import moment from "moment";

export async function getPendingJob(
  connection: Connection,
  plant: string,
  linecode: string,
  isRelatedDate: string,
  startdate?: string | null,
  enddate?: string | null
) {
  const current_date = moment().format("YYYY-MM-DD");
  let yesterday = moment().add(-1, "day").format("YYYY-MM-DD");
  let lookback_date = 1;
  if (moment(yesterday).format("dddd").toLowerCase() === "sunday") {
    yesterday = moment().add(-2, "day").format("YYYY-MM-DD");
    lookback_date = 2;
  }
  let sql = "";
  if (isRelatedDate === "true") {
    sql = `select
            p.FactoryNo,
            p.EST as ProdDate,
            p.production_line_code as ProdLine,
            p.code,
            cast(p.Quantity as SIGNED) as TotalPlanQty,
            count(b.WorkUser_BarCode) as TotalActualQty
          from
            cosmo_im_${plant}.base_production_order_t p
          left join
            cosmo_im_${plant}.bns_pm_scanhistory_month b on b.Code = p.Code
            and b.Type = 1
          where
            1 = 1
            and p.Production_Line_Code = '${linecode}'
            and p.est >= '${startdate}' and p.est <= '${
      moment(enddate) > moment() ? current_date : enddate
    }'
          group by
            p.FactoryNo,
            p.EST,
            p.production_line_code,
            p.code
          order by
            p.EST,
            p.production_line_code,
            p.Code;
          `;
  } else {
    sql = `select
              p.FactoryNo,
              p.EST as ProdDate,
              p.production_line_code as ProdLine,
              p.code,
              cast(p.Quantity as SIGNED) as TotalPlanQty,
              count(b.WorkUser_BarCode) as TotalActualQty
            from
              cosmo_im_${plant}.base_production_order_t p
            left join
              cosmo_im_${plant}.bns_pm_scanhistory_month b on b.Code = p.Code
              and b.Type = 1
              and b.ScanTime >= '${yesterday} 08:00:00' and b.ScanTime <= '${current_date} 07:59:59'
            where
              1 = 1
              and p.Production_Line_Code = '${linecode}'
              and p.est = '${yesterday}'
            group by
              p.FactoryNo,
              p.EST,
              p.production_line_code,
              p.code
            order by
              p.EST,
              p.production_line_code,
              p.Code;
            `;
  }

  return connection.query<RowDataPacket[]>(sql);
}
