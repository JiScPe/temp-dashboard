"use client";
import React, { useEffect, useState, useCallback } from "react";
import Navbar from "./Navbar";
import { Range } from "react-date-range";
import moment from "moment";
import { ImSpinner2 } from "react-icons/im";
import { calc_percent_rate } from "@/app/lib/delivery_helpers";
import { DeliveryDataType } from "@/app/types/delivery-type";
import EChartComponent from "./EChartComponent";
import { ECOption } from "@/app/types/chart-type";

const Delivery = () => {
  const [plant, setplant] = useState<string>("9771");
  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: moment().startOf("month").toDate(),
      endDate: moment().endOf("month").toDate(),
      key: "selection",
    },
  ]);
  const [isLoading, setisLoading] = useState(false);
  const [chartData, setchartData] = useState([]);
  const fetchingData = useCallback(async () => {
    console.log("fetching data...");
    setisLoading(true);
    const { startDate, endDate } = dateRange[0];
    const startDateStr = moment(startDate).format("YYYY-MM-DD");
    const endDateStr = moment(endDate).format("YYYY-MM-DD");
    // console.log(startDateStr, endDateStr)
    try {
      const { rows } = await fetch(
        `/api/delivery?startdate=${startDateStr}&enddate=${endDateStr}&plant=${plant}`
      ).then((res) => res.json());
      const newArr = rows.map(
        ({ month_week, allQty, timelyQty }: DeliveryDataType) => ({
          month_week,
          allQty,
          timelyQty,
          del_rate: calc_percent_rate(timelyQty, allQty),
        })
      );
      setchartData(newArr);
    } catch (error) {
      alert("Something went wrong! Please contact IT department");
      console.log("error:", error);
    } finally {
      setisLoading(false);
    }
  }, [dateRange, plant]);

  const onsubmit = async () => {
    fetchingData();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchingData();
    }, 5 * 60 * 1000);

    // Call fetchingData immediately when the component mounts
    fetchingData();

    // Clear the interval when the component unmounts or dependencies change
    return () => clearInterval(interval);
  }, [fetchingData]);

  const categories: Array<string> = chartData.map(
    ({ month_week }) => month_week
  );
  const totalData: Array<number> = chartData.map(({ allQty }) =>
    parseInt(allQty)
  );
  const actData: Array<number> = chartData.map(({ timelyQty }) =>
    parseInt(timelyQty)
  );
  const deliveryRate: Array<string> = chartData.map(({ del_rate }) => del_rate);
  const deliveryChartOption: ECOption = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["Total Delivery Qty", "On-time Delivery Qty", "On-time Delivery"],
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
        name: "Rate",
        position: "right",
        min: 0,
        max: 100,
        splitLine: {
          show: false,
        },
        axisLabel: {
          formatter: "{value} %",
          fontSize: 18,
        },
      },
    ],
    grid: {
      left: 10,
      containLabel: true,
      right: 30,
    },
    series: [
      {
        name: "Total Delivery Qty",
        type: "bar",
        data: totalData,
        label: {
          show: true,
          position: "outside",
          color: "#97a2b5",
          fontSize: 14,
        },
        itemStyle: {
          color: "#548bf3",
          borderRadius: [5, 5, 0, 0],
        },
        barWidth: 33,
      },
      {
        name: "On-time Delivery Qty",
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
        barWidth: 33,
      },
      {
        name: "On-time Delivery",
        type: "line",
        yAxisIndex: 1,
        data: deliveryRate,
        label: {
          show: true,
          position: "top",
          formatter: "{c}",
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
      fontSize: 18,
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
      />
      {isLoading && (
        <div className="h-[calc(100vh-80px)] overflow-auto w-full text-blue-600 flex flex-col justify-center items-center">
          <ImSpinner2 className="animate-spin" size={30} />
          <p>loading...</p>
        </div>
      )}
      <EChartComponent chartOption={deliveryChartOption} />
    </div>
  );
};

export default Delivery;
