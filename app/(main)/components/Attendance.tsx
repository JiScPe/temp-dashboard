"use client";
import React, { useState, useEffect, ChangeEvent, useCallback } from "react";
import Navbar from "./Navbar";
import { Range } from "react-date-range";
import { ImSpinner2 } from "react-icons/im";
import { calc_percent_rate } from "@/app/lib/delivery_helpers";
import { AttendanceType } from "@/app/types/attedance-type";
import EChartComponent from "./EChartComponent";
import { ECOption } from "@/app/types/chart-type";
import { useSearchParams } from "next/navigation";

const AttendanceComponent = () => {
  const [plant, setplant] = useState<string>("9771");
  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [isLoading, setisLoading] = useState(false);
  const [chartData, setchartData] = useState([]);
  const [intervalNumber, setintervalNumber] = useState<number>(5);
  const [showintervalInput, setshowintervalInput] = useState<boolean>(false);

  const fetchingData = useCallback(async () => {
    console.log("fetching attendance data...");
    setisLoading(true);

    try {
      const { rows } = await fetch(`/api/attendance?plant=${plant}`).then(
        (res) => res.json()
      );
      const newArr = rows.map(
        ({ total, act, divisionName }: AttendanceType) => ({
          total,
          act,
          divisionName,
          attendRate: calc_percent_rate(act.toString(), total.toString()),
        })
      );
      setchartData(newArr);
    } catch (error) {
      alert("Something went wrong! Please contact IT department");
      console.log("error:", error);
    } finally {
      setisLoading(false);
    }
  }, [plant]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchingData();
    }, intervalNumber * 60 * 1000);

    // Call fetchingData immediately when the component mounts
    fetchingData();

    // Clear the interval when the component unmounts or dependencies change
    return () => clearInterval(interval);
  }, [fetchingData, intervalNumber]);

  const onsubmit = async () => {
    fetchingData();
  };

  function handleIntervalInputChange(e: ChangeEvent<HTMLInputElement>) {
    setintervalNumber(parseInt(e.target.value));
  }
  const categories = chartData.map(({ divisionName }: any) => divisionName);
  const totalData = chartData.map(({ total }: any) => parseInt(total));
  const actData = chartData.map(({ act }: any) => parseInt(act));
  const attendRateData = chartData.map(({ attendRate }: any) => attendRate);
  const attChartOption: ECOption = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["Total", "Actual", "Attendance Rate"],
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
          fontSize: 14,
          rotate: 20,
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "Qty",
        position: "left",
        axisLabel: {
          fontSize: 18,
        },
        splitLine: {
          lineStyle: {
            color: "#244668",
          },
        },
      },
      {
        type: "value",
        name: "Attendance Rate",
        position: "right",
        min: 0,
        max: 100,
        splitLine: {
          show: false,
        },
        axisLabel: {
          formatter: "{value}",
          fontSize: 18,
        },
      },
    ],
    series: [
      {
        name: "Total",
        type: "bar",
        data: totalData,
        label: {
          show: true,
          position: "top",
          color: "#97a2b5",
          fontSize: 14,
        },
        itemStyle: {
          color: "#548bf3",
          borderRadius: [5, 5, 0, 0],
        },
        barWidth: 20,
      },
      {
        name: "Actual",
        type: "bar",
        data: actData,
        label: {
          show: true,
          position: "top",
          color: "#97a2b5",
          fontSize: 14,
        },
        itemStyle: {
          color: "#40f4ec",
          borderRadius: [5, 5, 0, 0],
        },
        barWidth: 20,
      },
      {
        name: "Attendance Rate",
        type: "line",
        yAxisIndex: 1,
        data: attendRateData,
        label: {
          show: true,
          position: "top",
          formatter: "{c} %",
          color: "#ffffff",
          fontSize: 18,
        },
        itemStyle: {
          color: "#d2cb97",
        },
      },
    ],
    textStyle: {
      color: "#9cbbd7",
      fontSize: 20,
    },
  };

  return (
    <div>
      <Navbar
        plant={plant}
        setplant={setplant}
        daterange={dateRange}
        setdaterange={setDateRange}
        onsubmit={onsubmit}
        setshowinterval={setshowintervalInput}
      />

      {isLoading && (
        <div className="h-[calc(100vh-80px)] overflow-auto w-full text-blue-600 flex flex-col justify-center items-center">
          <ImSpinner2 className="animate-spin" size={30} />
          <p>loading...</p>
        </div>
      )}

      {/* Interval input */}
      {showintervalInput && (
        <div className="flex justify-end w-full gap-2 text-haier-text-gray items-center">
          <label htmlFor="interval">refresh every: </label>
          <input
            type="text"
            max={60}
            min={1}
            value={intervalNumber}
            onChange={handleIntervalInputChange}
            name="interval"
            className="text-sm w-12 text-center py-1 rounded-sm bg-transparent border-2 border-[#193b69] focus:outline-none"
          />
          <label htmlFor="interval">minutes</label>
        </div>
      )}
      {/* Chart */}
      <div>
        <EChartComponent chartOption={attChartOption} />
      </div>
    </div>
  );
};

export default AttendanceComponent;
