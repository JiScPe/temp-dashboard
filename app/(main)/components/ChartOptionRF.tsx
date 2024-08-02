"use client";
import React from "react";
import { ECOption } from "@/app/types/chart-type";
import EChartComponent from "../components/EChartComponent";

type Props = {
  uniqueArr: string[];
  duplicateArr: number[];
  chartRate: "PendingRate" | "CompleteRate";
  chartType: "bar" | "line";
  RFRA: number[];
  RFRB: number[];
};

const ChartOptionRF = ({ uniqueArr, duplicateArr, chartRate, chartType, RFRA, RFRB }: Props) => {
  const chartOptionRF: ECOption = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["Line A", "Line B"],
      top: 0,
      textStyle: {
        color: "#9cbbd7",
        fontSize: 20,
      },
    },
    xAxis: [
      {
        type: "category",
        data: uniqueArr.filter((_item, index) => !duplicateArr.includes(index)),
        axisLabel: {
          fontSize: 18,
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: chartRate === "PendingRate" ? "Job Pending Rate" : "Job Complete Rate",
        position: "left",
        min: 0,
        max: 100,
        splitLine: {
          lineStyle: {
            color: "#244668",
          },
        },
        axisLabel: {
          formatter: "{value}%",
          fontSize: 18,
        },
      },
    ],
    grid: {
      left: 80,
      containLabel: true,
    },
    series: [
      {
        name: "Line A",
        type: chartType,
        yAxisIndex: 0,
        data: RFRA.filter((_item, index) => !duplicateArr.includes(index)),
        label: {
          show: true,
          position: "top",
          formatter: "{c}",
          color: "#97a2b5",
          fontSize: 14,
        },
        itemStyle: {
          color: "#548bf3",
        },
      },
      {
        name: "Line B",
        type: chartType,
        yAxisIndex: 0,
        data: RFRB.filter((_item, index) => !duplicateArr.includes(index)),
        label: {
          show: true,
          position: "top",
          formatter: "{c}",
          color: "#97a2b5",
          fontSize: 14,
        },
        itemStyle: {
          color: "#40f4ec",
        },
      },
    ],
    textStyle: {
      color: "#9cbbd7",
      fontSize: 16,
    },
  };

  return <EChartComponent chartOption={chartOptionRF} />;
};

export default ChartOptionRF;
