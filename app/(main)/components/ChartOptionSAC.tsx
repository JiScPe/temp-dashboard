"use client";
import React from "react";
import { ECOption } from "@/app/types/chart-type";
import EChartComponent from "../components/EChartComponent";

type Props = {
  uniqueArr: string[];
  duplicateArr: number[];
  chartRate: "PendingRate" | "CompleteRate";
  chartType: "bar" | "line";
  SACW1: number[];
  SACW2: number[];
  SACIN: number[];
  SACN2: number[];
  SACN3: number[];
  SACOU: number[];
  SACU2: number[];
  SACU3: number[];
};

const ChartOptionSAC = ({ uniqueArr, duplicateArr, chartRate, chartType, SACW1, SACW2, SACIN, SACN2, SACN3, SACOU, SACU2, SACU3 }: Props) => {
  const chartOptionSAC: ECOption = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["Line 1", "Line 2", "Indoor 1", "Indoor 2", "Indoor 3", "Outdoor 1", "Outdoor 2", "Outdoor 3"],
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
        data: SACW1.filter((_item, index) => !duplicateArr.includes(index)),
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
        data: SACW2.filter((_item, index) => !duplicateArr.includes(index)),
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
        name: "Indoor 1",
        type: chartType,
        yAxisIndex: 0,
        data: SACIN.filter((_item, index) => !duplicateArr.includes(index)),
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
      {
        name: "Indoor 2",
        type: chartType,
        yAxisIndex: 0,
        data: SACN2.filter((_item, index) => !duplicateArr.includes(index)),
        label: {
          show: true,
          position: "top",
          formatter: "{c}",
          color: "#97a2b5",
          fontSize: 14,
        },
        itemStyle: {
          color: "#07478a",
        },
      },
      {
        name: "Indoor 3",
        type: chartType,
        yAxisIndex: 0,
        data: SACN3.filter((_item, index) => !duplicateArr.includes(index)),
        label: {
          show: true,
          position: "top",
          formatter: "{c}",
          color: "#97a2b5",
          fontSize: 14,
        },
        itemStyle: {
          color: "#a63b55",
        },
      },
      {
        name: "Outdoor 1",
        type: chartType,
        yAxisIndex: 0,
        data: SACOU.filter((_item, index) => !duplicateArr.includes(index)),
        label: {
          show: true,
          position: "top",
          formatter: "{c}",
          color: "#97a2b5",
          fontSize: 14,
        },
        itemStyle: {
          color: "#a6638b",
        },
      },
      {
        name: "Outdoor 2",
        type: chartType,
        yAxisIndex: 0,
        data: SACU2.filter((_item, index) => !duplicateArr.includes(index)),
        label: {
          show: true,
          position: "top",
          formatter: "{c}",
          color: "#97a2b5",
          fontSize: 14,
        },
        itemStyle: {
          color: "#8b3a3a",
        },
      },
      {
        name: "Outdoor 3",
        type: chartType,
        yAxisIndex: 0,
        data: SACU3.filter((_item, index) => !duplicateArr.includes(index)),
        label: {
          show: true,
          position: "top",
          formatter: "{c}",
          color: "#97a2b5",
          fontSize: 14,
        },
        itemStyle: {
          color: "#6b4f4f",
        },
      },
    ],
    textStyle: {
      color: "#9cbbd7",
      fontSize: 16,
    },
  };

  return <EChartComponent chartOption={chartOptionSAC} />;
};

export default ChartOptionSAC;
