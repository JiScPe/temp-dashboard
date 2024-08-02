"use client";
import { ECOption } from "@/app/types/chart-type";
import moment from "moment";
import React, { useEffect, useState, useCallback, ChangeEvent } from "react";
import { Range } from "react-date-range";
import Navbar from "../components/Navbar";
import { ImSpinner2 } from "react-icons/im";
import EChartComponent from "../components/EChartComponent";
import ChartOptionRF from "../components/ChartOptionRF";
import ChartOptionWAC from "../components/ChartOptionWAC";
import ChartOptionSAC from "../components/ChartOptionSAC";

const ProductionComponent = () => {
  const [plant, setPlant] = useState<string>("9771");
  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: moment().startOf("month").toDate(),
      endDate: moment().endOf("month").toDate(),
      key: "selection",
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const [chartRate, setChartRate] = useState<"PendingRate" | "CompleteRate">("PendingRate");

  const fetchingData = useCallback(async () => {
    console.log("fetching completerate data...");
    setIsLoading(true);
    const { startDate, endDate } = dateRange[0];
    const startDateStr = moment(startDate).format("YYYY-MM-DD");
    const endDateStr = moment(endDate).format("YYYY-MM-DD");

    try {
      const { rows } = await fetch(
        `/api/completerate?startdate=${startDateStr}&enddate=${endDateStr}&plant=${plant}`
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

  const categories: string[] = chartData.map(({ ProdDate }: any) =>
    moment(ProdDate).format("MM-DD")
  );
  const uniqueArr = categories.filter(
    (value, index, self) => self.indexOf(value) === index
  );

  const RFRA: any[] = chartData
    .filter(({ ProdLine }: any) => ProdLine === "RA")
    .map(({ PendingRate, CompleteRate }: any) =>
      chartRate === "PendingRate" ? parseFloat(PendingRate) : parseFloat(CompleteRate)
    );
  const RFRB: any[] = chartData
    .filter(({ ProdLine }: any) => ProdLine === "RB")
    .map(({ PendingRate, CompleteRate }: any) =>
      chartRate === "PendingRate" ? parseFloat(PendingRate) : parseFloat(CompleteRate)
    );

  const WACW1: any[] = chartData
    .filter(({ ProdLine }: any) => ProdLine === "W1")
    .map(({ PendingRate, CompleteRate }: any) =>
      chartRate === "PendingRate" ? parseFloat(PendingRate) : parseFloat(CompleteRate)
    );
  const WACW2: any[] = chartData
    .filter(({ ProdLine }: any) => ProdLine === "W2")
    .map(({ PendingRate, CompleteRate }: any) =>
      chartRate === "PendingRate" ? parseFloat(PendingRate) : parseFloat(CompleteRate)
    );
  const WACWC: any[] = chartData
    .filter(({ ProdLine }: any) => ProdLine === "WC")
    .map(({ PendingRate, CompleteRate }: any) =>
      chartRate === "PendingRate" ? parseFloat(PendingRate) : parseFloat(CompleteRate)
    );

  const SACW1: any[] = chartData
    .filter(({ ProdLine }: any) => ProdLine === "W1")
    .map(({ PendingRate, CompleteRate }: any) =>
      chartRate === "PendingRate" ? parseFloat(PendingRate) : parseFloat(CompleteRate)
    );
  const SACW2: any[] = chartData
    .filter(({ ProdLine }: any) => ProdLine === "W2")
    .map(({ PendingRate, CompleteRate }: any) =>
      chartRate === "PendingRate" ? parseFloat(PendingRate) : parseFloat(CompleteRate)
    );
  const SACIN: any[] = chartData
    .filter(({ ProdLine }: any) => ProdLine === "IN")
    .map(({ PendingRate, CompleteRate }: any) =>
      chartRate === "PendingRate" ? parseFloat(PendingRate) : parseFloat(CompleteRate)
    );
  const SACN2: any[] = chartData
    .filter(({ ProdLine }: any) => ProdLine === "N2")
    .map(({ PendingRate, CompleteRate }: any) =>
      chartRate === "PendingRate" ? parseFloat(PendingRate) : parseFloat(CompleteRate)
    );
  const SACN3: any[] = chartData
    .filter(({ ProdLine }: any) => ProdLine === "N3")
    .map(({ PendingRate, CompleteRate }: any) =>
      chartRate === "PendingRate" ? parseFloat(PendingRate) : parseFloat(CompleteRate)
    );
  const SACOU: any[] = chartData
    .filter(({ ProdLine }: any) => ProdLine === "OU")
    .map(({ PendingRate, CompleteRate }: any) =>
      chartRate === "PendingRate" ? parseFloat(PendingRate) : parseFloat(CompleteRate)
    );
  const SACU2: any[] = chartData
    .filter(({ ProdLine }: any) => ProdLine === "U2")
    .map(({ PendingRate, CompleteRate }: any) =>
      chartRate === "PendingRate" ? parseFloat(PendingRate) : parseFloat(CompleteRate)
    );
  const SACU3: any[] = chartData
    .filter(({ ProdLine }: any) => ProdLine === "U3")
    .map(({ PendingRate, CompleteRate }: any) =>
      chartRate === "PendingRate" ? parseFloat(PendingRate) : parseFloat(CompleteRate)
    );

  const duplicateArr: number[] = [];
  uniqueArr.forEach((item, index: number) => {
    if (RFRA[index] === 0 && RFRB[index] === 0 || RFRA[index] === 100 && RFRB[index] === 100) {
      duplicateArr.push(index);
    }
    if (WACW1[index] === 0 && WACW2[index] === 0 && WACWC[index] === 0 
      || WACW1[index] === 100 && WACW2[index] === 100 && WACWC[index] === 100
    ) {
      duplicateArr.push(index);
    }
    if (SACW1[index] === 0 && SACW2[index] === 0 && SACIN[index] === 0 && SACN2[index] === 0 && SACN3[index] === 0 && SACOU[index] === 0 && SACU2[index] === 0 && SACU3[index] === 0
      || SACW1[index] === 100 && SACW2[index] === 100 && SACIN[index] === 100 && SACN2[index] === 100 && SACN3[index] === 100 && SACOU[index] === 100 && SACU2[index] === 100 && SACU3[index] === 0
    ) {
      duplicateArr.push(index);
    }
  });

  function handleChartTypeChange(event: ChangeEvent<HTMLSelectElement>) {
    setChartType(event.target.value as "bar" | "line");
  }

  function handleChartRateChange(event: ChangeEvent<HTMLSelectElement>) {
    setChartRate(event.target.value as "PendingRate" | "CompleteRate");
  }

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
      <select
        name="charttype"
        id="charttype"
        onChange={handleChartTypeChange}
        className="text-[#445e81] shadow-none bg-opacity-0 bg-inherit border-2 rounded-sm border-[#193b69] focus:outline-none w-14"
      >
        <option value="bar">bar</option>
        <option value="line">line</option>
      </select>
      <select
        name="chartrate"
        id="chartrate"
        onChange={handleChartRateChange}
        className="text-[#445e81] shadow-none bg-opacity-0 bg-inherit border-2 rounded-sm border-[#193b69] focus:outline-none w-14"
      >
        <option value="PendingRate">Pending Rate</option>
        <option value="CompleteRate">Complete Rate</option>
      </select>
    {plant === "9771" && <ChartOptionRF
            uniqueArr={uniqueArr}
            duplicateArr={duplicateArr}
            chartRate={chartRate}
            chartType={chartType}
            RFRA={RFRA}
            RFRB={RFRB}
          />}
    {plant === "9773" && <ChartOptionWAC
            uniqueArr={uniqueArr}
            duplicateArr={duplicateArr}
            chartRate={chartRate}
            chartType={chartType}
            WACW1={WACW1}
            WACW2={WACW2}
            WACWC={WACWC}
          />}
    {plant === "9774" && <ChartOptionSAC
            uniqueArr={uniqueArr}
            duplicateArr={duplicateArr}
            chartRate={chartRate}
            chartType={chartType}
            SACW1={SACW1}
            SACW2={SACW2}
            SACIN={SACIN}
            SACN2={SACN2}
            SACN3={SACN3}
            SACOU={SACOU}
            SACU2={SACU2}
            SACU3={SACU3}
          />}
    </div>
  );
};

export default ProductionComponent;
