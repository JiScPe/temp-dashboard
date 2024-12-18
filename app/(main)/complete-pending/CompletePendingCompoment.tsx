"use client";
import RedirectNavbar from "@/app/components/RedirectNavbar";
import {
  GroupedDataType,
  getPendingJobRate,
} from "@/app/lib/utility/getPendingJobRate";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Accum from "./Accum";
import CompPendChart from "./CompPendChart";
import { PendingJobType } from "./page";

export interface CompleteRateI {
  date: string;
  act_qty: number;
  plan_qty: number;
}

export type AccumCompRateType = {
  plan_qty: number;
  act_qty: number;
  rate: number;
  date?: string;
};

type Props = {
  plan_qty: number;
  actual_qty: number;
  comp_rate: CompleteRateI[];
  accum?: AccumCompRateType;
  pending_job_rate?: GroupedDataType | undefined;
};

const CompletePendingCompoment = ({
  plan_qty,
  actual_qty,
  comp_rate,
  accum,
  pending_job_rate,
}: Props) => {
  const searchParams = useSearchParams();
  const plant = searchParams.get("plant");
  const prod_line = searchParams.get("linecode");
  const startdate = searchParams.get("startdate");
  const enddate = searchParams.get("enddate");
  const [isRelateSelectDate, setisRelateSelectDate] = useState(true);
  const [pendingJob, setpendingJob] = useState<Props>({
    plan_qty: plan_qty,
    actual_qty: actual_qty,
    comp_rate: comp_rate,
  });
  const [accum_comp_rate, setaccum_comp_rate] = useState<AccumCompRateType>({
    plan_qty: accum?.plan_qty || 0,
    act_qty: accum?.act_qty || 0,
    rate: accum?.rate || 0,
    date: "",
  });
  const [pendingJobRate, setpendingJobRate] = useState(pending_job_rate);
  const [isLoading, setisLoading] = useState(false);

  const chartData = comp_rate;

  function handleSwitchChange() {
    // console.log("switch activate");
    setisRelateSelectDate(!isRelateSelectDate);
  }

  async function fetchPendinJobRate() {
    const res = await fetch(
      `/api/pendingjob?plant=${plant}&linecode=${prod_line}&related=true&startdate=${startdate}&enddate=${enddate}`
    );
    const data: PendingJobType[] = await res.json();

    return data;
  }

  const fetchPendingJob = useCallback(async () => {
    setisLoading(true);
    try {
      // Get Total Pending Job
      const res = await fetch(
        `/api/pendingjob?plant=${plant}&linecode=${prod_line}&related=${isRelateSelectDate.toString()}&startdate=${startdate}&enddate=${enddate}`
      );
      const data: PendingJobType[] = await res.json();
      let plan_qty: number =
        data?.reduce((acc, cur) => {
          return cur.TotalPlanQty + acc;
        }, 0) || 0;
      let act_qty: number =
        data?.reduce((acc, cur) => {
          return cur.TotalActualQty + acc;
        }, 0) || 0;
      setpendingJob({
        plan_qty: plan_qty,
        actual_qty: act_qty,
        comp_rate: [...pendingJob.comp_rate],
      });

      // Get Pending job Rate
      const pendingRateData = await fetchPendinJobRate();
      const result = await getPendingJobRate(pendingRateData, plant, prod_line);
      console.log(result);
      setpendingJobRate(result);
      let plan_qty_related =
        result?.reduce((acc, cur) => {
          return cur.plan_qty + acc;
        }, 0) || 0;
      let act_qty_related =
        result?.reduce((acc, cur) => {
          return cur.act_qty + acc;
        }, 0) || 0;
      setpendingJob({
        plan_qty: isRelateSelectDate ? plan_qty_related : plan_qty,
        actual_qty: isRelateSelectDate ? act_qty_related : act_qty,
        comp_rate: [...pendingJob.comp_rate],
      });
      // End Get Pending job Rate

      // Get Complete Rate
      const acc_comp_res = await fetch(
        `api/job-completerate?plant=${plant}&linecode=${prod_line}&startdate=${startdate}&enddate=${enddate}&related=${isRelateSelectDate}`
      );
      const acc_comp_data: AccumCompRateType[] = await acc_comp_res.json();
      if (isRelateSelectDate === true) {
        // Calculate accum complete rate
        const accum_comp_rate = acc_comp_data.reduce(
          (acc: any, item: any) => {
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
        setaccum_comp_rate(accum_comp_rate);
      } else {
        setaccum_comp_rate(acc_comp_data[0]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setisLoading(false);
    }
  }, [isRelateSelectDate, plant, prod_line, startdate, enddate]);

  useEffect(() => {
    fetchPendingJob();

    return () => {
      setpendingJob({ plan_qty: 0, actual_qty: 0, comp_rate: [] });
    };
  }, [fetchPendingJob]);

  return (
    <main className="h-[calc(100vh)] text-haier-text-gray overflow-y-hidden">
      <RedirectNavbar
        url="/complete-pending"
        plant={plant || undefined}
        linecode={prod_line || undefined}
        startdate={new Date(startdate || "")}
        enddate={new Date(enddate || "")}
      />
      <div className="grid grid-cols-1 p-3 2xl:p-5 gap-2">
        {/* First Row: Pending Job and Completion Rate */}
        <div className="grid grid-cols-4 gap-3">
          {/* Pending Job Component */}
          <Accum
            title="Pending Job"
            description="Offline qty of job"
            isRelateSelectDate={isRelateSelectDate}
            startdate={startdate}
            enddate={enddate}
            handleSwitchChange={handleSwitchChange}
            isLoading={isLoading}
            pendingJobData={pendingJob}
          />

          {/* Completion Rate Chart */}
          <CompPendChart
            startdate={startdate}
            enddate={enddate}
            chartData={pendingJobRate}
            title="Job Pending Rate"
            dataKey={{
              x_axis: "date",
              y_axis: "rate",
              bar1: "plan_qty",
              bar2: "act_qty",
              line: "rate",
            }}
          />
        </div>
        {/* Add new rows */}
        {/* Second Row: Additional Components */}
        <div className="grid grid-cols-4 gap-3">
          {/* Another Pending Job Component */}
          <Accum
            title="Efficiency"
            description="Plan qty compare with Offline qty"
            isRelateSelectDate={isRelateSelectDate}
            startdate={startdate}
            enddate={enddate}
            handleSwitchChange={handleSwitchChange}
            isLoading={isLoading}
            accum_comp_rate={accum_comp_rate}
          />
          {/* Another Completion Rate Chart */}
          <CompPendChart
            startdate={startdate}
            enddate={enddate}
            chartData={chartData}
            title="Job Complete Rate"
            dataKey={{
              x_axis: "date",
              y_axis: "rate",
              bar1: "plan_qty",
              bar2: "act_qty",
              line: "rate",
            }}
          />
        </div>
      </div>
    </main>
  );
};

export default CompletePendingCompoment;
