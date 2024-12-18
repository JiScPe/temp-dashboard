import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip as Tooltips,
} from "@/components/ui/tooltip";
import moment from "moment";
import { BsInfoCircle } from "react-icons/bs";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CompleteRateI } from "./CompletePendingCompoment";
import CustomizeLabel from "./CustomizeLabel";

type DataKeyType = {
  x_axis: string;
  y_axis: string;
  bar1?: string;
  bar2?: string;
  line?: string;
};

type Props = {
  startdate: string | null;
  enddate: string | null;
  chartData: CompleteRateI[] | any;
  title: string;
  dataKey: DataKeyType;
};

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

const CompPendChart = ({ chartData, title, dataKey }: Props) => {
  return (
    <div className="col-span-3 ">
      <Card className="bg-background text-haier-text-gray h-full">
        <CardHeader className="pb-0">
          <CardTitle className="flex justify-between">
            <p className="text-xl">{title}</p>
            <TooltipProvider>
              <Tooltips>
                <TooltipTrigger>
                  <BsInfoCircle size={18} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Total Offline qty / Plan qty <small>for each day</small>
                  </p>
                </TooltipContent>
              </Tooltips>
            </TooltipProvider>
          </CardTitle>
        </CardHeader>
        <CardContent className="w-full h-full pb-0">
          <ResponsiveContainer width={"100%"} height={"80%"}>
            <ChartContainer
              config={chartConfig}
              className="min-h-[150px] text-white w-full"
            >
              <ComposedChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey={dataKey.x_axis}
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
                  dataKey={dataKey.y_axis}
                  orientation="right"
                  tickFormatter={(value) => value + "%"}
                  label={{
                    value: "rate",
                    position: "insideTop",
                    offset: -25,
                    textAnchor: "middle",
                  }}
                  allowDecimals={true}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Tooltip cursorStyle={{ backgroundColor: "red" }} />
                <Legend verticalAlign="top" height={36} />
                <Bar
                  dataKey={dataKey.bar1 || "plan_qty"}
                  fill="hsl(var(--color-plan))"
                  radius={4}
                  label
                  barSize={35}
                />
                <Bar
                  dataKey={dataKey.bar2 || "act_qty"}
                  fill="hsl(var(--color-act))"
                  radius={4}
                  label
                  barSize={35}
                />
                <Line
                  type="monotone"
                  dataKey={dataKey.line}
                  stroke="#ff7300"
                  yAxisId={1}
                  strokeWidth={2}
                  label={<CustomizeLabel />}
                />
              </ComposedChart>
            </ChartContainer>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompPendChart;
