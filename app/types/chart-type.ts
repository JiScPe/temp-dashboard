import type { ComposeOption } from "echarts/core";
import type {
  // The series option types are defined with the SeriesOption suffix
  BarSeriesOption,
  LineSeriesOption,
} from "echarts/charts";
import type {
  // The component option types are defined with the ComponentOption suffix
  TitleComponentOption,
  TooltipComponentOption,
  GridComponentOption,
  DatasetComponentOption,
} from "echarts/components";

export type ECOption = ComposeOption<
| BarSeriesOption
| LineSeriesOption
| TitleComponentOption
| TooltipComponentOption
| GridComponentOption
| DatasetComponentOption
>;