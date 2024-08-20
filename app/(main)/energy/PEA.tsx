"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { iPEA } from "@/app/types/energy-type";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import moment from "moment";
import { RenderDateToString } from "@/app/lib/date-to-str";

const chartConfig = {
  rate_b: {
    label: "usage",
    color: "#ffffff",
  },
} satisfies ChartConfig;

type Props = {
  pea_data: iPEA[];
  pea_data_err: {
    error: boolean;
    message: string;
    errResponse: any;
  };
};

export default function PEA({ pea_data, pea_data_err }: Props) {
  const { toast } = useToast();
  const { error, message, errResponse } = pea_data_err;

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
  }, [pea_data, pea_data_err]);

  if (error) {
    return (
      <div className="col-span-3 row-span-2 text-white">Error! No data.</div>
    );
  }

  const maxUsage = Math.max(...pea_data.map((item) => item.usage));

  return (
    <Card className="col-span-3 row-span-2 bg-opacity-5 bg-white backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-blue-600">Electric Consumption</CardTitle>
        <CardDescription>
          Showing Electric data according the date you select
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[600px] w-full">
          <AreaChart
            accessibilityLayer
            data={pea_data}
            margin={{
              left: 5,
              right: 5,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => moment(value).format("DD")}
            />
            <YAxis domain={[0, maxUsage + 100]} unit={"kWh"} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="usage"
              type="natural"
              fill="hsl(var(--color-pea))"
              fillOpacity={0.4}
              stroke="hsl(var(--color-pea))"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {RenderDateToString(new Date(pea_data[0].date), "DD/MMM/YYYY")} -{" "}
              {RenderDateToString(
                new Date(pea_data[pea_data.length - 1].date),
                "DD/MMM/YYYY"
              )}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
