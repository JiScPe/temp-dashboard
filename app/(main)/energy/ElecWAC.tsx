"use client";
import { RenderDateToString } from "@/app/lib/date-to-str";
import { iElecWAC } from "@/app/types/energy-type";
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
import { Switch } from "@/components/ui/switch";
import moment from "moment";
import React, { Dispatch, SetStateAction } from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

const chartConfig = {
  rate_b: {
    label: "usage",
    color: "#ffffff",
  },
} satisfies ChartConfig;

type Props = {
  elec_data: iElecWAC[];
  toggle: string;
  settoggle: Dispatch<SetStateAction<string>>;
};

const ElecWAC = ({ elec_data, toggle, settoggle }: Props) => {
  console.log("elec: ", elec_data);
  const maxUsage = Math.max(...elec_data.map((item) => item.f_consumption));

  function handleSwitchChange() {
    if (toggle === "factory") {
      settoggle("wac");
    } else {
      settoggle("factory");
    }
  }

  return (
    <Card className="col-span-3 row-span-2 bg-opacity-5 bg-white backdrop-blur-md">
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className="text-blue-600">Electric Consumption</CardTitle>
          <div className="flex text-haier-text-gray gap-2 text-sm uppercase">
            <p>factory</p>
            <Switch
              onClick={handleSwitchChange}
              checked={toggle === "factory" ? false : true}
            />
            <p>WAC</p>
          </div>
        </div>
        <CardDescription>
          Showing Electric data according the date you select
        </CardDescription>
      </CardHeader>
      <CardContent>
        {elec_data.length < 1 ? (
          <div>No data.</div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="h-[300px] 2xl:h-[650px] w-full"
          >
            <LineChart
              accessibilityLayer
              data={elec_data}
              margin={{
                left: 10,
                right: 5,
                top: 30,
                bottom: 30,
              }}
            >
              <CartesianGrid vertical={false} />
              <Legend verticalAlign="top" height={20} />
              <XAxis
                dataKey="f_date"
                tickLine={false}
                axisLine={false}
                tickMargin={20}
                tickFormatter={(value) => moment(value).format("DD-MM-YYYY")}
                angle={315}
              />
              <YAxis domain={[0, Math.ceil(maxUsage + 100)]} unit={"kWh"} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    className="text-white"
                  />
                }
              />
              <Line
                dataKey={"wac_line1"}
                type="natural"
                strokeWidth={2}
                stroke="hsl(var(--color-wacline1))"
                dot={false}
              />
              <Line
                dataKey={"wac_line2"}
                type="natural"
                strokeWidth={2}
                stroke="hsl(var(--color-wacline2))"
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {RenderDateToString(
                new Date(elec_data[0]?.f_date),
                "DD/MMM/YYYY"
              )}
              {" - "}
              {RenderDateToString(
                new Date(elec_data[elec_data.length - 1]?.f_date),
                "DD/MMM/YYYY"
              )}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ElecWAC;
