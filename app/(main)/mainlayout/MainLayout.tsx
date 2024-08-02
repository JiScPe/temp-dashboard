"use client";
import { IdleTimeI } from "@/app/types/idletime-type";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import MainLayoutNav from "./MainLayoutNav";
import Image from "next/image";
import { coordinate } from "@/app/lib/utility/coordination";
import { productionLineList } from "@/app/lib/utility/prodLine";

type Props = {
  data: IdleTimeI[];
  getIdleTime: (plant: string | null, prod_line: string | null) => Promise<any>;
};

const MainLayout = ({ data, getIdleTime }: Props) => {
  const searchParams = useSearchParams();
  const plant = searchParams.get("plant");
  const prod_line = searchParams.get("prod_line");
  const [newdata, setnewdata] = useState(data);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (plant && prod_line) {
        const updatedData = await getIdleTime(plant, prod_line);
        let combinedArr: any = [];
        if (updatedData) {
          combinedArr = updatedData.map((item: IdleTimeI, idx: number) => {
            return { ...item, ...coordinate[idx] };
          });
        }
        setnewdata(combinedArr);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [plant, prod_line, getIdleTime]);

  if (data.length < 1) {
    return (
      <div>
        <MainLayoutNav />
        <p>No data!</p>
      </div>
    );
  }

  function headerDisplay() {
    if (!plant || !prod_line) {
      return "";
    }

    const plantName = productionLineList.find(
      (item) => item.plant === plant
    )?.plant_name;
    const lineName = productionLineList
      .find((item) => item.plant === plant)
      ?.prodline.find(({ line_code }) => line_code === prod_line)?.line_name;

    if (!plantName || !lineName) {
      return "";
    }

    return plantName + " : " + lineName;
  }

  return (
    <div>
      <MainLayoutNav />
      <h1 className="w-full text-center text-slate-200">
        {headerDisplay()}
      </h1>
      <div className="w-4/5 mx-auto">
        <div className="relative">
          <Image
            src={"/assets/images/RF_Prod_Layout.png"}
            alt="RF_Prod_Layout"
            width={1000}
            height={600}
            layout="responsive"
          />
          {newdata.map(
            ({
              Work_Cell_Desc,
              idleTime,
              colum_index,
              top,
              topinfo,
              toplg,
              toplginfo,
              left,
              leftlg,
              leftinfo,
              leftlginfo,
            }) => (
              <React.Fragment key={colum_index}>
                <span
                  id="station"
                  className={`absolute ${top} ${left} ${toplg} ${leftlg}  size-5 border-2 border-black ${
                    idleTime > 100
                      ? "bg-red-600"
                      : idleTime > 30
                      ? "bg-yellow-400"
                      : "bg-emerald-400"
                  } rounded-full`}
                >
                  {" "}
                </span>
                {idleTime > 30 && (
                  <div
                    className={`absolute text-white ${toplginfo} ${leftlginfo} ${topinfo} ${leftinfo} fade-out-50 duration-2000 h-10 p-2 rounded-md border-2 border-gray-600 flex bg-opacity-70 ${
                      idleTime > 100
                        ? "bg-red-600"
                        : idleTime > 30
                        ? "bg-yellow-400"
                        : "bg-slate-500"
                    }`}
                  >
                    {Work_Cell_Desc}: {idleTime}
                  </div>
                )}
              </React.Fragment>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
