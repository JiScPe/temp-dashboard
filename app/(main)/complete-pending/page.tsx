import React from "react";
import CompletePendingCompoment from "./CompletePendingCompoment";
import { Metadata } from "next";

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
    related: boolean
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
    `${API_URL}/api/pendingjob?plant=${plant || 9771}&linecode=${linecode}&related=${related || false}`,
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

  // complete rate
  const complete_rate_res = await fetch(
    `${API_URL}/api/job-completerate?plant=${plant}&linecode=${linecode}&startdate=${startdate}&enddate=${enddate}`
  );
  const comp_rate_data = await complete_rate_res.json();

  return (
    <CompletePendingCompoment
      plan_qty={plan_qty}
      actual_qty={act_qty}
      comp_rate={comp_rate_data}
    />
  );
};

export default CompletePending;
