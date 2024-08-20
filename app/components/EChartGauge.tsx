"use client";
import React, { useRef, useEffect } from "react";
import * as echarts from "echarts";
import { ECOption } from "@/app/types/chart-type";
import { n2GaugeOption, oxyGaugeOption } from "@/constant/gauge-option";
import { getGaugeOption } from "../lib/utility/getGaugeOption";

type Props = {
  value: number;
  name: string;
  alarmLevel: string;
};

const EChartGauge = ({ value, name, alarmLevel }: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const chartOption = getGaugeOption(value, name, alarmLevel);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);
    chartInstance.setOption(chartOption);
    window.addEventListener("resize", () => {
      chartInstance.resize();
    });

    return () => {
      chartInstance.dispose();
    };
  }, [chartOption]);

  return <div ref={chartRef} className="z-2 w-full h-[300px] text-sm p-0 m-0"></div>;
};

export default EChartGauge;
