"use client";
import React, { useRef, useEffect } from "react";
import * as echarts from "echarts";
import { ECOption } from "@/app/types/chart-type";

type Props = {
  chartOption: ECOption;
};

const EChartComponent = ({ chartOption }: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);
    chartInstance.setOption(chartOption);
    window.addEventListener("resize", () => {
      // chartInstance.resize();
    });

    return () => {
      chartInstance.dispose();
    };
  }, [chartOption]);

  return (
    <div ref={chartRef} className="z-2 h-[calc(100vh-120px)] m-0 md:m-2 lg:mx-10 lg:mt-10 p-0 text-sm md:text-lg lg:text-xl font-bold"></div>
  );
};

export default EChartComponent;
