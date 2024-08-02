"use client";
import React, { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import CurrentTime from "./CurrentTime";
import { DateRangePicker, Range, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { RenderDateToString } from "@/app/lib/date-to-str";
import UpdateBtn from "./UpdateBtn";
import { usePathname } from "next/navigation";

type Props = {
  plant: string;
  setplant: Dispatch<SetStateAction<string>>;
  daterange: Range[];
  setdaterange: Dispatch<React.SetStateAction<Range[]>>;
  onsubmit: () => void;
  setshowinterval?: Dispatch<SetStateAction<boolean>>;
};

const Navbar = ({
  plant,
  setplant,
  daterange,
  setdaterange,
  onsubmit,
  setshowinterval,
}: Props) => {
  const pathname = usePathname();
  const { startDate, endDate } = daterange[0];
  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };
  const [isShowing, setisShowing] = useState<boolean>(false);

  function handleDateChange(ranges: RangeKeyDict) {
    setdaterange([ranges.selection]);
  }

  function handleHoverNav() {
    if (setshowinterval) {
      setshowinterval(true);
      setTimeout(() => {
        setshowinterval(false);
      }, 10000);
    }
  }

  function handlePlantSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    console.log("plant: ", event.target.value)
    setplant(event.target.value);
  }

  return (
    <nav
      className="h-8 md:h-12 xl:h-20 w-full flex items-center text-haier-text-gray bg-gradient-to-b from-haier-dark to-haier-blue bg-opacity-20 text-[11px] lg:text-lg box-border pr-8 lg:pr-4"
      onMouseEnter={handleHoverNav}
    >
      {/* Title */}
      <div className="py-6 pl-3 pr-8 border-r-2 border-b-2 border-solid border-[#4f7ccd] rounded-br-full">
        <h1 className="text-xs md:text-lg lg:text-3xl font-extrabold tracking-wider bg-gradient-to-t from-blue-400 to-white bg-clip-text text-transparent">
          Thailand Factory Dashboard
        </h1>
      </div>
      {/* Input Parameter */}
      <div className="flex flex-grow justify-between">
        <div>
          <label htmlFor="plant">Plant:</label>
          <select
            name="plant"
            id="plant"
            className="text-[#445e81] shadow-none bg-opacity-0 bg-inherit border-2 rounded-sm border-[#193b69] focus:outline-none w-14"
            value={plant}
            onChange={handlePlantSelectChange}
          >
            <option value="9771">RF</option>
            <option value="9773">WAC</option>
            <option value="9774">SAC</option>
          </select>
        </div>
        <div>
          {pathname.includes("attendance") ? null : (
            <div>
              Date:{" "}
              <input
                type="text"
                value={`${RenderDateToString(
                  startDate,
                  "YYYY-MM-DD"
                )} - ${RenderDateToString(endDate, "YYYY-MM-DD")}`}
                className="text-sm w-60 text-center py-1 rounded-sm bg-transparent border-2 border-[#193b69] focus:outline-none"
                onFocus={() => setisShowing(!isShowing)}
                readOnly
              />
            </div>
          )}
          {isShowing && (
            <div className="absolute mt-2 flex flex-col z-10">
              <DateRangePicker
                editableDateInputs
                ranges={[selectionRange]}
                onChange={handleDateChange}
                moveRangeOnFirstSelection={false}
                weekStartsOn={0}
              />
              <button
                className="w-full bg-blue-800 bg-opacity-60 hover:bg-opacity-90 hover:text-slate-300"
                onClick={() => setisShowing(false)}
              >
                OK
              </button>
            </div>
          )}
        </div>
        <div>
          <UpdateBtn text="Updata" onbtnclick={() => onsubmit()} />
        </div>
        {/* Current Time */}
        <div className="font-semibold text-[16px] pr-7">
          <CurrentTime />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
