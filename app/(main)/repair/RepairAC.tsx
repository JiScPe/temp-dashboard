import { RepairI } from "@/app/types/repair-type";
import React from "react";
import RepairStation from "./RepairStation";

type Props = {
  lineList: string[];
  dataList: RepairI[];
};

const RepairAC = ({ lineList, dataList }: Props) => {
  return (
    <div
      className={`mt-5 ${
        lineList.length > 4 ? "w-11/12" : "container"
      } mx-auto h-[screen-80px]`}
    >
      <div
        className={`grid ${
          lineList.length > 4 ? "grid-cols-3 gap-5" : "grid-cols-2 gap-10"
        }`}
      >
        {lineList.map((line) => (
          <div className="m-3" key={line}>
            <div className="w-1/4 bg-gradient-to-br from-transparent to-haier-blue h-9 text-haier-text-gray px-4 flex items-center rounded-r-md">
              <p className="text-2xl">{line}</p>
            </div>
            <div className="grid grid-cols-2 gap-5">
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

export default RepairAC;
