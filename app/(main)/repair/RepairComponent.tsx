"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import RepairStation from "./RepairStation";
import { RepairI } from "@/app/types/repair-type";
import RepairAC from "./RepairAC";

const RepairComponent = () => {
  const searchParams = useSearchParams();
  const plant = searchParams.get("plant");
  const [dataList, setdataList] = useState<RepairI[]>([]);

  function fetchRepairData() {
    fetch(`/api/repair_rate?plant=${plant}`)
      .then((res) => res.json())
      .then((data) => setdataList(data.rows));
  }

  useEffect(() => {
    fetchRepairData();
    const interval = setInterval(async () => {
      fetchRepairData();
    }, 1000 * 5);

    return () => {
      clearInterval(interval);
    };
  }, [plant]);

  const lineList = dataList
    .map(({ line_code }) => line_code)
    .reduce((acc, curr) => {
      // If the accumulator (acc) does not already include the current value (curr)
      if (!acc.includes(curr)) {
        // Add the current value to the accumulator
        acc.push(curr);
      }
      // Return the updated accumulator for the next iteration
      return acc;
    }, [] as string[]);

  if (dataList.length < 1) {
    return (
      <div className="mt-5 container mx-auto h-[screen-80px]">
        <p className="text-white">No data.</p>
      </div>
    );
  }

  if (plant !== "9771") {
    return <RepairAC lineList={lineList} dataList={dataList} />;
  }

  return (
    <div className="mt-5 container mx-auto h-[screen-80px] flex">
      <div className="flex flex-col gap-7 w-full">
        {lineList.map((line) => (
          <div className="m-3" key={line}>
            <div className="w-1/4 bg-gradient-to-br from-transparent to-haier-blue h-9 text-haier-text-gray px-4 flex items-center rounded-r-md">
              <p className="text-2xl">{line}</p>
            </div>
            <div className="grid grid-cols-4 gap-10">
              {dataList
                .filter(({ line_code }) => line_code === line)
                .sort((a, b) => a.rank - b.rank)
                .reduce((acc, curr) => {
                  let existing = acc.find((item) => item.rank === curr.rank);
                  if (existing) {
                    existing.scan_station += " & " + curr.scan_station;
                    existing.input_qty += curr.input_qty;
                    existing.output_qty += curr.output_qty;
                    existing.remain_qty += curr.remain_qty;
                  } else {
                    acc.push({ ...curr });
                  }
                  return acc;
                }, [] as RepairI[])
                .map((item) => (
                  <RepairStation repairData={item} key={item.rank} />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RepairComponent;
