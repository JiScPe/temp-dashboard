import React from "react";
import CompletePendingCompoment, {
  CompleteRateI,
} from "./CompletePendingCompoment";
import { Metadata } from "next";
import { getPendingJobRate } from "@/app/lib/utility/getPendingJobRate";

export const metadata: Metadata = {
  title: "CompleteRate & PendingJob Report",
  description: "CompleteRate & PendingJob Report",
};

type Props = {
  searchParams: {
    plant: string;
    linecode: string;
    startdate: string;
    enddate: string;
    related: boolean;
  };
};

export type PendingJobType = {
  FactoryNo: string;
  ProdDate: string;
  ProdLine: string;
  code: string;
  TotalPlanQty: number;
  TotalActualQty: number;
};

const CompletePending = async ({ searchParams }: Props) => {
  const API_URL: string | undefined = process.env.API_URL;
  const { plant, linecode, startdate, enddate, related } = searchParams;

  // pending job query
  const res = await fetch(
    `${API_URL}/api/pendingjob?plant=${
      plant || 9771
    }&linecode=${linecode}&related=${related || false}`,
    {
      cache: "no-cache",
    }
  );
  if (res.status !== 200) {
    throw new Error("Somethings went wrong! Please contact administrator.");
  }
  const pendingjob_data: PendingJobType[] = await res.json();

  let plan_qty: number =
    pendingjob_data?.reduce((acc, cur) => {
      return cur.TotalPlanQty + acc;
    }, 0) || 0;
  let act_qty: number =
    pendingjob_data?.reduce((acc, cur) => {
      return cur.TotalActualQty + acc;
    }, 0) || 0;

  const pendingJobRate = await getPendingJobRate(
    pendingjob_data,
    plant,
    linecode
  );
  // complete rate
  const complete_rate_res = await fetch(
    `${API_URL}/api/job-completerate?plant=${plant}&linecode=${linecode}&startdate=${startdate}&enddate=${enddate}`
  );
  const comp_rate_data = await complete_rate_res.json();

  // Calculate accum complete rate
  const accum_comp_rate = comp_rate_data.reduce(
    (acc: CompleteRateI, item: any) => {
      acc.act_qty += item.act_qty;
      acc.plan_qty += item.plan_qty;
      return acc;
    },
    { act_qty: 0, plan_qty: 0 }
  );
  // Calculate accumulated rate
  accum_comp_rate.rate = (
    (accum_comp_rate.act_qty / accum_comp_rate.plan_qty) *
    100
  ).toFixed(2);
  // Convert rate back to number
  accum_comp_rate.rate = parseFloat(accum_comp_rate.rate);

  return (
    <CompletePendingCompoment
      plan_qty={plan_qty}
      actual_qty={act_qty}
      comp_rate={comp_rate_data.sort(
        (a: any, b: any) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      )}
      accum={accum_comp_rate}
      pending_job_rate={pendingJobRate}
    />
  );
};

export default CompletePending;
