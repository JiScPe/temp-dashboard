"use client";
import RedirectNavbar from "@/app/components/RedirectNavbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import moment from "moment";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CustomizeLabel from "./CustomizeLabel";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PendingJobType } from "./page";
import { BsInfoCircle } from "react-icons/bs";
import {
  Tooltip as Tooltips,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PendingjobLoading from "./PendingjobLoading";

interface CompleteRateI {
  date: string;
  act_qty: number;
  plan_qty: number;
}

type Props = {
  plan_qty: number;
  actual_qty: number;
  comp_rate: CompleteRateI[];
};

const CompletePendingCompoment = ({
  plan_qty,
  actual_qty,
  comp_rate,
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
  const [isLoading, setisLoading] = useState(false);

  const chartConfig = {
    plan_qty: {
      label: "Plan",
      color: "hsl(val(--chart-1))",
    },
    act_qty: {
      label: "Offline",
      color: "hsl(val(--chart-2))",
    },
  };

  const chartData = comp_rate;

  function handleSwitchChange() {
    // console.log("switch activate");
    setisRelateSelectDate(!isRelateSelectDate);
  }

  const fetchPendingJob = useCallback(async () => {
    setisLoading(true);
    try {
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
    <main className="h-[calc(100vh-80px)] text-haier-text-gray">
      <RedirectNavbar
        url="/complete-pending"
        plant={plant || undefined}
        linecode={prod_line || undefined}
        startdate={new Date(startdate || "")}
        enddate={new Date(enddate || "")}
      />
      <div className="grid grid-cols-4 m-5 gap-5">
        {/* Pending Job Component */}
        <div className="col-1 flex flex-col min-h-full">
          <Card className="bg-background text-haier-text-gray">
            <CardHeader className="flex justify-between">
              <div>
                <CardTitle className="flex justify-between w-full">
                  <p>Pending Job</p>
                  <TooltipProvider>
                    <Tooltips>
                      <TooltipTrigger>
                        <BsInfoCircle size={18} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {isRelateSelectDate
                            ? "Offline quantity of Plan date"
                            : "Offline quantity of Yesterday"}
                        </p>
                      </TooltipContent>
                    </Tooltips>
                  </TooltipProvider>
                </CardTitle>
                <CardDescription>
                  Of{" "}
                  {isRelateSelectDate
                    ? `${startdate} - ${enddate}`
                    : `Yesterday`}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="relate-date"
                  style={{ padding: 0 }}
                  checked={isRelateSelectDate}
                  onClick={handleSwitchChange}
                  className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
                />
                <Label htmlFor="relate-date">Relate selected date</Label>
              </div>
            </CardHeader>
            {isLoading ? (
              <PendingjobLoading />
            ) : (
              <CardContent className="flex flex-col 2xl:h-[700px] h-[390px] font-semibold text-xl 2xl:text-4xl gap-3">
                <div className="w-full text-center h-1/3 flex flex-col justify-center items-center bg-blue-600 bg-opacity-10 rounded-md">
                  <h2>{pendingJob.plan_qty}</h2>
                  <p className="text-sm 2xl:text-lg">Plan</p>
                </div>
                <div className="w-full text-center h-1/3 flex flex-col justify-center items-center bg-blue-600 bg-opacity-10 rounded-md">
                  <h2>{pendingJob.actual_qty}</h2>
                  <p className="text-sm 2xl:text-lg">Offline</p>
                </div>
                <div className="w-full text-center h-1/3 flex justify-center items-center bg-blue-600 bg-opacity-10 rounded-md">
                  <h2>
                    {pendingJob.plan_qty === 0
                      ? 0
                      : (
                          (pendingJob.actual_qty / pendingJob.plan_qty) *
                          100
                        ).toFixed(2)}
                    %
                  </h2>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
        {/* Completerate Chart */}
        <div className="col-span-3">
          <div className="w-full min-h-1/2">
            <Card className="bg-background text-haier-text-gray">
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <p>Job Complete Rate</p>
                  <TooltipProvider>
                    <Tooltips>
                      <TooltipTrigger>
                        <BsInfoCircle size={18} />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Total Offline qty / Plan qty{" "}
                          <small>for each day</small>
                        </p>
                      </TooltipContent>
                    </Tooltips>
                  </TooltipProvider>
                </CardTitle>
                <CardDescription>{`${moment(startdate).format(
                  "DD MMM"
                )} - ${moment(enddate).format("DD MMM")}`}</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={chartConfig}
                  className="h-[390px] 2xl:h-[700px] text-white w-full"
                >
                  <ComposedChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickSize={10}
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) => moment(value).format("DD-MMM")}
                    />
                    <YAxis
                      label={{
                        value: "Quantity",
                        position: "insideTop",
                        offset: -25,
                        textAnchor: "middle",
                      }}
                    />
                    <YAxis
                      yAxisId={1}
                      dataKey={"rate"}
                      orientation="right"
                      tickFormatter={(value) => value + "%"}
                      label={{
                        value: "rate",
                        position: "insideTop",
                        offset: -25,
                        textAnchor: "middle",
                      }}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="dashed" />}
                    />
                    <Tooltip cursorStyle={{ backgroundColor: "red" }} />
                    <Legend verticalAlign="top" height={36} />
                    <Bar
                      dataKey="plan_qty"
                      fill="hsl(var(--color-plan))"
                      radius={4}
                      label
                    />
                    <Bar
                      dataKey="act_qty"
                      fill="hsl(var(--color-act))"
                      radius={4}
                      label
                    />
                    <Line
                      type="monotone"
                      dataKey="rate"
                      stroke="#ff7300"
                      yAxisId={1}
                      strokeWidth={2}
                      label={<CustomizeLabel />}
                    />
                  </ComposedChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CompletePendingCompoment;
