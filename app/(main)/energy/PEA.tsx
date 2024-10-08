"use client";
import { RenderDateToString } from "@/app/lib/date-to-str";
import { iPEA } from "@/app/types/energy-type";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import moment from "moment";
import React, { Dispatch, SetStateAction } from "react";
import { Switch } from "@/components/ui/switch";

const chartConfig = {
  rate_b: {
    label: "usage",
    color: "#ffffff",
  },
} satisfies ChartConfig;

type Props = {
  pea_data: iPEA[];
  toggle: string;
  settoggle: Dispatch<SetStateAction<string>>;
};

const PEA = ({ pea_data, toggle, settoggle }: Props) => {
  const maxUsage = Math.max(...pea_data.map((item) => item.usage));

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
          <div className="flex text-haier-text-gray gap-2 text-md uppercase">
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
        {pea_data.length < 1 ? (
          <div>No data.</div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="h-[300px] 2xl:h-[650px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={pea_data}
              margin={{
                left: 10,
                right: 5,
                top: 30,
                bottom: 30,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={20}
                tickFormatter={(value) => moment(value).format("DD/MM/YYYY")}
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
              <Bar
                dataKey="usage"
                type="natural"
                fill="hsl(var(--color-pea))"
                fillOpacity={0.9}
                radius={4}
                stroke="hsl(var(--color-pea))"
              >
                <LabelList
                  dataKey={"usage"}
                  position={"insideTop"}
                  offset={8}
                  className="fill-secondary"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {RenderDateToString(new Date(pea_data[0]?.date), "DD/MMM/YYYY")}
              {" - "}
              {RenderDateToString(
                new Date(pea_data[pea_data.length - 1]?.date),
                "DD/MMM/YYYY"
              )}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PEA;
