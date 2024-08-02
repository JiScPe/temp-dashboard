"use client";
import React, { useRef, useEffect } from "react";
import * as echarts from "echarts";
import { ECOption } from "@/app/types/chart-type";

type Props = {
  chartOption: ECOption;
};

const EChartMaterial = ({ chartOption }: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      ref={chartRef}
      className="chart-container"
      style={{ height: '50vh', width: '100%' }} // Adjust the height to 50vh
    ></div>
  );
};

export default EChartMaterial;
