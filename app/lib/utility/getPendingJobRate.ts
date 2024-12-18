"use server";

import { PendingJobType } from "@/app/(main)/complete-pending/page";
import moment from "moment";

export type GroupedDataType = {
  date: string;
  plan_qty: number;
  act_qty: number;
  rate: number;
}[];

interface PendingJobRes {
  date: string;
  plan_qty: number;
  act_qty: number;
  rate: number;
}

const API_URL: string | undefined = process.env.API_URL;

export async function getPendingJobRate(
  data: PendingJobType[],
  plant: string | null,
  linecode: string | null
): Promise<PendingJobRes[]> {
  const uniqueDate = Array.from(
    new Set(
      data
        .map((item) => JSON.stringify(item.ProdDate))
        .map((item) => JSON.parse(item))
    )
  );
  const results = await Promise.all(
    uniqueDate.map(async (date: string) => {
      const dateStr = moment(date).format("YYYY-MM-DD");
      const fullUrl = `${API_URL}/api/pendingjob/onedate?plant=${
        plant || 9771
      }&linecode=${linecode || "RA"}&startdate=${dateStr}`;
      const res = await fetch(fullUrl, {
        cache: "no-cache",
      });
      const pendingjob_data: PendingJobType[] = await res.json();
      const plan_qty: number =
        pendingjob_data?.reduce((acc, cur) => cur.TotalPlanQty + acc, 0) || 0;
      const act_qty: number =
        pendingjob_data?.reduce((acc, cur) => cur.TotalActualQty + acc, 0) || 0;
      const rate: number = plan_qty === 0 ? 0 : (act_qty / plan_qty) * 100;

      return {
        date: dateStr,
        plan_qty,
        act_qty,
        rate,
      };
    })
  );

  return results.sort((a, b) => a.date.localeCompare(b.date));
}
