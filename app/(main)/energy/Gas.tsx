"use client";
import { iGas } from "@/app/types/energy-type";
import React, { useEffect, useState } from "react";
import { ECOption } from "@/app/types/chart-type";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import EChartGauge from "../../components/EChartGauge";
import { n2GaugeOption, oxyGaugeOption } from "@/constant/gauge-option";
import { getGaugeOption } from "@/app/lib/utility/getGaugeOption";
import { Cell, Pie, PieChart } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  gas_data: iGas[];
  gas_data_err: {
    error: boolean;
    message: string;
    errResponse: any;
  };
};

const Gas = ({ gas_data, gas_data_err }: Props) => {
  const { toast } = useToast();
  const { error, message, errResponse } = gas_data_err;
  const GasLevelData = gas_data.filter(
    ({ dataChannelDescription }) =>
      dataChannelDescription.toLowerCase() === "level"
  );

  console.log(GasLevelData);

  function handleToastActionClick() {
    navigator.clipboard.writeText(JSON.stringify(errResponse));
  }

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: message,
        action: (
          <ToastAction altText="CopyError" onClick={handleToastActionClick}>
            CopyError
          </ToastAction>
        ),
      });
    }
  }, [gas_data, gas_data_err]);

  if (error) {
    return (
      <div className="col-span-3 row-span-2 text-white">Error! No data.</div>
    );
  }

  const chartData = [
    { level: "critical", value: 42, fill: "var(--color-safari)" },
    { level: "reorder", value: 56, fill: "var(--color-firefox)" },
    { level: "full", value: 160, fill: "var(--color-chrome)" },
  ];
  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    chrome: {
      label: "Chrome",
      color: "hsl(var(--chart-1))",
    },
    safari: {
      label: "Safari",
      color: "hsl(var(--chart-2))",
    },
    firefox: {
      label: "Firefox",
      color: "hsl(var(--chart-3))",
    },
    edge: {
      label: "Edge",
      color: "hsl(var(--chart-4))",
    },
    other: {
      label: "Other",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardContent>
        <ChartContainer config={chartConfig} className="">
          <PieChart>
            <Pie
              startAngle={180}
              endAngle={0}
              data={chartData}
              dataKey="value"
              nameKey="level"
              innerRadius={50}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
export default Gas;
