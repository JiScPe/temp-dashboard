"use client";
import React from "react";
import { ECOption } from "@/app/types/chart-type";
import EChartComponent from "../components/EChartComponent";

type Props = {
  uniqueArr: string[];
  duplicateArr: number[];
  chartRate: "PendingRate" | "CompleteRate";
  chartType: "bar" | "line";
  WACW1: number[];
  WACW2: number[];
  WACWC: number[];
};

const ChartOptionWAC = ({ uniqueArr, duplicateArr, chartRate, chartType, WACW1, WACW2, WACWC }: Props) => {
  const chartOptionWAC: ECOption = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["Line 1", "Line 2", "WC Line"],
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
        name: "Line 1",
        type: chartType,
        yAxisIndex: 0,
        data: WACW1.filter((_item, index) => !duplicateArr.includes(index)),
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
        name: "Line 2",
        type: chartType,
        yAxisIndex: 0,
        data: WACW2.filter((_item, index) => !duplicateArr.includes(index)),
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
      {
        name: "WC Line",
        type: chartType,
        yAxisIndex: 0,
        data: WACWC.filter((_item, index) => !duplicateArr.includes(index)),
        label: {
          show: true,
          position: "top",
          formatter: "{c}",
          color: "#97a2b5",
          fontSize: 14,
        },
        itemStyle: {
          color: "#047e21",
        },
      },
    ],
    textStyle: {
      color: "#9cbbd7",
      fontSize: 16,
    },
  };

  return <EChartComponent chartOption={chartOptionWAC} />;
};

export default ChartOptionWAC;
