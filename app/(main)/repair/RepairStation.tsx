"use client";
import { RepairI } from "@/app/types/repair-type";
import React from "react";

type Props = {
  repairData: RepairI;
};

const RepairStation = ({ repairData }: Props) => {
  const { input_qty, output_qty, remain_qty, line_code, scan_station, rank } =
    repairData;

  return (
    <div className="relative mt-5">
      <div className="h-60 bg-slate-100 bg-opacity-20 backdrop-blur-sm rounded-xl flex flex-col">
        <div className="h-full flex items-center justify-center text-center">
          <p className="text-gray-300 px-5">{scan_station}</p>
        </div>
        <div className="flex justify-between">
          <CardBottomItem
            value={input_qty}
            label={"input"}
            extraStyle="rounded-bl-xl"
          />
          <CardBottomItem value={output_qty} label={"output"} />
          <CardBottomItem
            value={remain_qty}
            label={"remain"}
            extraStyle="rounded-br-xl"
          />
        </div>
      </div>
      <span className="absolute right-5 -top-3 text-sm px-2 bg-[#062554] text-blue-300 rounded-md border border-blue-900">
        Repair: {rank}
      </span>
    </div>
  );
};

function CardBottomItem({
  value,
  label,
  extraStyle,
}: {
  value: number;
  label: string;
  extraStyle?: string;
}) {
  let bg: string;
  let border: string;

  if (label === "output") {
    border = "border-x border-blue-900";
  } else {
    border = "border-none";
  }

  return (
    <div
      className={`w-full flex flex-col text-center py-5 bg-[#062554] ${border} ${extraStyle}`}
    >
      <h6
        className={`text-2xl font-semibold ${
          label === "remain" && value > 0 ? "text-orange-600" : "text-blue-300"
        }`}
      >
        {value}
      </h6>
      <p className="text-sm text-haier-text-gray">{label}</p>
    </div>
  );
}

export default RepairStation;
