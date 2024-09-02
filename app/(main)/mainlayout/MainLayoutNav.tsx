"use client";
import { productionLineList } from "@/app/lib/utility/prodLine";
import { useRouter, useSearchParams } from "next/navigation";
import React, { ChangeEvent, useState } from "react";

const MainLayoutNav = () => {
  const searchParams = useSearchParams();
  const plant = searchParams.get("plant");
  const prod_line = searchParams.get("prod_line");
  const [selectedPlant, setselectedPlant] = useState(plant || "");
  const [selectedLine, setselectedLine] = useState(prod_line || "");
  const route = useRouter();

  function handleBtnClick() {
    route.push(`/mainlayout?plant=${selectedPlant}&prod_line=${selectedLine}`);
  }

  function handleSelectPlantChange(event: ChangeEvent<HTMLSelectElement>) {
    setselectedPlant(event.target.value);
    const line = productionLineList.find(
      ({ plant }) => plant === event.target.value
    )?.prodline[0].line_code;
    if (line) {
      setselectedLine(line);
    }
  }

  function handleSelectLineChange(event: ChangeEvent<HTMLSelectElement>) {
    setselectedLine(event.target.value);
  }

  return (
    <div>
      <select
        name="plant"
        id="plant"
        onChange={handleSelectPlantChange}
        value={selectedPlant}
      >
        <option>select plant</option>
        <option value="9771">RF</option>
        <option value="9773">WAC</option>
        <option value="9774">SAC</option>
      </select>
      <select
        name="plant"
        id="plant"
        onChange={handleSelectLineChange}
        defaultValue={"select plant"}
      >
        {selectedPlant !== "" ? (
          productionLineList
            .find(({ plant }) => plant === selectedPlant)
            ?.prodline.map(({ line_code, line_name }) => (
              <option value={line_code} key={line_code}>
                {line_name}
              </option>
            ))
        ) : (
          <option>select line</option>
        )}
      </select>
      <button onClick={handleBtnClick} className="text-white">
        search
      </button>
    </div>
  );
};

export default MainLayoutNav;
