"use client";
import React, { useEffect, useState, useCallback } from "react";
import Navbar from "./Navbar";
import { Range } from "react-date-range";
import EChartMaterial from "./EChartMaterial";
import Dashboard from "./Dashboard";
import moment from "moment";
import { ECOption } from "@/app/types/chart-type";
import { ImSpinner2 } from "react-icons/im";

const MaterialReceiptComponent = () => {
  const [plant, setPlant] = useState<string>("9771");
  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: moment().startOf("month").toDate(),
      endDate: moment().endOf("month").toDate(),
      key: "selection",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const fetchingData = useCallback(async () => {
    console.log("fetching material data...");
    setIsLoading(true);
    const { startDate, endDate } = dateRange[0];
    const startDateStr = moment(startDate).format("YYYY-MM-DD");
    const endDateStr = moment(endDate).format("YYYY-MM-DD");

    try {
      const { rows } = await fetch(
        `/api/material?startdate=${startDateStr}&enddate=${endDateStr}&plant=${plant}`
      ).then((res) => res.json());
      setChartData(rows);
    } catch (error) {
      alert("Something went wrong! Please contact IT department");
      console.log("error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, plant]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchingData();
    }, 5 * 60 * 1000);

    // Call fetchingData immediately when the component mounts
    fetchingData();

    // Clear the interval when the component unmounts or dependencies change
    return () => clearInterval(interval);
  }, [fetchingData]);

  useEffect(() => {
    if (plant === "9773" || plant === "9774") {
      const plantSwitchInterval = setInterval(() => {
        setPlant((prevPlant) => (prevPlant === "9773" ? "9774" : "9773"));
      }, 5 * 60 * 1000);

      return () => clearInterval(plantSwitchInterval);
    }
  }, [plant]);

  useEffect(() => {
    fetchingData();
  }, [plant, fetchingData]);

  const onSubmit = async () => {
    fetchingData();
  };

  const categories = chartData.map(({ CreateDate }: any) =>
    moment(CreateDate).format("MM-DD")
  );
  const completeRateData = chartData.map(({ CompleteRate }: any) =>
    parseFloat(CompleteRate).toFixed(2)
  );
  const HdvCompleteRateData = chartData.map(({ CompleteRateHV }: any) =>
    parseFloat(CompleteRateHV).toFixed(2)
  );
  const chartOption: ECOption = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["T-1 Material Kitting Rate", 'Hv Complete Rate'],
      top: 0,
      textStyle: {
        color: "#9cbbd7",
        fontSize: 20,
      },
    },
    xAxis: [
      {
        type: "category",
        data: categories,
        axisLabel: {
          fontSize: 18,
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "T-1 Material Kitting Rate",
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
        name: "T-1 Material Kitting Rate",
        type: "line",
        yAxisIndex: 0,
        data: completeRateData,
        label: {
          show: true,
          position: "top",
          formatter: "{c}",
          color: "#ffffff",
          fontSize: 18,
        },
        itemStyle: {
          color: "#548bf3",
        },
      },
      {
        name: "Hv Complete Rate",
        type: "line",
        yAxisIndex: 0,
        data: HdvCompleteRateData,
        label: {
          show: true,
          position: "top",
          formatter: "{c}",
          color: "#ffffff",
          fontSize: 18,
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

  return (
    <div>
      <Navbar
        plant={plant}
        setplant={setPlant}
        daterange={dateRange}
        setdaterange={setDateRange}
        onsubmit={onSubmit}
      />
      {isLoading && (
        <div className="h-[calc(100vh-80px)] overflow-auto w-full text-blue-600 flex flex-col justify-center items-center">
          <ImSpinner2 className="animate-spin" size={30} />
          <p>loading...</p>
        </div>
      )}
      <div style={{ marginTop: "20px" }}>
        <EChartMaterial chartOption={chartOption} />
        <Dashboard plant={plant} />
      </div>
    </div>
  );
};

export default MaterialReceiptComponent;
