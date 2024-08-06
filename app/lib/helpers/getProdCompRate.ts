import { Connection, RowDataPacket } from "mysql2";
import { getProdLineList } from "../utility/getProdlineList";

export async function getProdCompRate(
  connection: Connection,
  startdate: string,
  enddate: string,
  plant: string
) {
  const sql = `select
                p.FactoryNo,
                p.EST as ProdDate,
                substr(p.Edition, 2, 2) as ProdLine,
                ifnull(SUM(p.Quantity), '0.00') as TotalPlanQty,
                ifnull(SUM(p.ActualQuantity), '0.00') as TotalActualQty,
                ifnull((SUM(p.ActualQuantity)/ SUM(p.Quantity))* 100, '0.00') as CompleteRate,
                ifnull(format(100-((SUM(p.ActualQuantity)/ SUM(p.Quantity))* 100), 2), '0.00') as PendingRate
            from
                cosmo_im_${plant}.base_production_order_t p
            where
                1 = 1
                and substr(p.Edition, 2, 2) in ${getProdLineList(plant)}
                and date(p.EST) between '${startdate}' and '${enddate}'
            group by
                p.FactoryNo,
                p.EST,
                substr(p.Edition, 2, 2)
            order by
                p.EST,
                substr(p.Edition, 2, 2);`
            
  return connection.query<RowDataPacket[]>(sql);
}
