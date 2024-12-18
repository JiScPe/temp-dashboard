"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import CurrentTime from "./CurrentTime";
import UpdateBtn from "./UpdateBtn";
import { DateRangePicker, Range, RangeKeyDict } from "react-date-range";
import { RenderDateToString } from "@/app/lib/date-to-str";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import moment from "moment";

type Props = {
  plant?: string;
  linecode?: string;
  url: string;
  startdate?: Date;
  enddate?: Date;
  //   fetchRepairData: (plant: string | null) => Promise<any>;
};

const RedirectNavbar = ({
  plant,
  linecode,
  url,
  startdate,
  enddate,
}: Props) => {
  const [plantName, setplantName] = useState(plant || "");
  const [lineCode, setlineCode] = useState(linecode || "RA");
  const [isFirstParam, setisFirstParam] = useState<boolean>(false);
  const [isShowing, setisShowing] = useState<boolean>(false);
  const router = useRouter();
  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: startdate || new Date(),
      endDate: enddate || new Date(),
      key: "selection",
    },
  ]);
  const { startDate, endDate } = dateRange[0];
  const selectionRange = {
    startDate: startDate,
    endDate: endDate,
    key: "selection",
  };

  function handlePlantSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    setplantName(event.target.value);
    switch (event.target.value) {
      case "9771":
        setlineCode("RA");
        break;
      case "9773":
        setlineCode("W1");
        break;
      case "9774":
        setlineCode("IN");
        break;
      default:
        setlineCode("");
        break;
    }
    // router.push(`/repair?plant=${event.target.value}`);
  }

  function handleLineCodeSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    setlineCode(event.target.value);
  }

  function handleDateChange(ranges: RangeKeyDict) {
    setDateRange([ranges.selection]);
  }

  function handleSearchBtnClick() {
    let paramsList: { name: string; value: string | Date | undefined }[] = [];
    let fullUrl = url;
    if (plantName) {
      paramsList.push({ name: "plant", value: plantName });
    }
    if (lineCode) {
      paramsList.push({ name: "linecode", value: lineCode });
    }
    if (dateRange) {
      paramsList.push({
        name: "startdate",
        value: moment(startDate).format("YYYY-MM-DD"),
      });
      paramsList.push({
        name: "enddate",
        value: moment(endDate).format("YYYY-MM-DD"),
      });
    }
    paramsList.forEach(({ name, value }, idx) => {
      if (idx === 0) {
        fullUrl += `?${name}=${value}`;
      } else {
        fullUrl += `&${name}=${value}`;
      }
    });
    console.log(fullUrl);
    router.push(fullUrl);
  }

  function renderLineOption() {
    switch (plantName) {
      case "9771":
        const linelist = [
          { value: "RA", linename: "RA" },
          { value: "RB", linename: "RB" },
        ];
        return linelist.map(({ value, linename }) => (
          <option key={value} value={value}>
            {linename}
          </option>
        ));
      case "9773":
        const linelistWAC = [
          { value: "W1", linename: "W1" },
          { value: "W2", linename: "W2" },
          { value: "WC", linename: "AIO" },
        ];
        return linelistWAC.map(({ value, linename }) => (
          <option key={value} value={value}>
            {linename}
          </option>
        ));
      case "9774":
        const linelistSAC = [
          { value: "W1", linename: "W1" },
          { value: "W2", linename: "W2" },
          { value: "IN", linename: "Indoor1" },
          { value: "N2", linename: "Indoor2" },
          { value: "N3", linename: "Indoor3" },
          { value: "OU", linename: "Outdoor1" },
          { value: "U2", linename: "Outdoor2" },
          { value: "U3", linename: "Outdoor3" },
        ];
        return linelistSAC.map(({ value, linename }) => (
          <option key={value} value={value}>
            {linename}
          </option>
        ));
      default:
        break;
    }
  }

  return (
    <nav className="h-8 md:h-12 xl:h-20 w-full flex items-center text-haier-text-gray bg-gradient-to-b from-haier-dark to-haier-blue bg-opacity-20 text-[11px] lg:text-lg box-border pr-8 lg:pr-4">
      {/* Title */}
      <div className="py-6 pl-3 pr-8 border-r-2 border-b-2 border-solid border-[#4f7ccd] rounded-br-full">
        <h1 className="text-xs md:text-lg lg:text-3xl font-extrabold tracking-wider bg-gradient-to-t from-blue-400 to-white bg-clip-text text-transparent">
          Thailand Factory Dashboard
        </h1>
      </div>
      {/* Input Parameter */}
      <div className="flex flex-grow justify-between">
        <div className="flex justify-start gap-3">
          {/* plant selection */}
          {plant && (
            <div>
              <label htmlFor="plant">Plant:</label>
              <select
                name="plant"
                id="plant"
                className="text-[#445e81] shadow-none bg-opacity-0 bg-inherit border-2 rounded-sm border-[#193b69] focus:outline-none w-14"
                value={plantName}
                onChange={handlePlantSelectChange}
              >
                <option value="">Select Plant</option>
                <option value="9771">RF</option>
                <option value="9773">WAC</option>
                <option value="9774">SAC</option>
              </select>
            </div>
          )}
          {/* line code selection */}
          {linecode && (
            <div>
              <label htmlFor="lineCode">Line:</label>
              <select
                name="lineCode"
                id="lineCode"
                className="text-[#445e81] shadow-none bg-opacity-0 bg-inherit border-2 rounded-sm border-[#193b69] focus:outline-none w-28"
                value={lineCode}
                onChange={handleLineCodeSelectChange}
              >
                {renderLineOption()}
              </select>
            </div>
          )}
          {/* date selection */}
          {
            <div>
              <input
                type="text"
                value={`${RenderDateToString(
                  startDate,
                  "YYYY-MM-DD"
                )} - ${RenderDateToString(endDate, "YYYY-MM-DD")}`}
                className="text-sm w-48 lg:w-48 2xl:w-60 text-center py-1 rounded-sm bg-transparent border-2 border-[#193b69] focus:outline-none"
                onFocus={() => setisShowing(!isShowing)}
                readOnly
              />
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
          }
          {/* search button */}
          <UpdateBtn onbtnclick={handleSearchBtnClick} text="Search" />
        </div>
        {/* Current Time */}
        <div className="font-semibold text-sm 2xl:text-[16px] pr-7">
          <CurrentTime />
        </div>
      </div>  
    </nav>
  );
};

export default RedirectNavbar;
