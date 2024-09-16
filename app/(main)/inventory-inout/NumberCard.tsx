"use client";
import { ErrorRes, inventoryInOutType } from "@/app/types/inven-inout-type";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import Counter from "./Counter";
import { ImSpinner2 } from "react-icons/im";
import moment from "moment";

const NumberCard = () => {
  const searchParams = useSearchParams();
  const plant = searchParams.get("plant");
  const [inventoryData, setinventoryData] = useState<
    inventoryInOutType[] | ErrorRes
  >([]);
  const [isLoading, setisLoading] = useState(true);
  const curr_date = new Date();

  const fetchData = useCallback(async () => {
    const res = await fetch(
      `/api/inventory?plant=${plant}&startdate=${moment(curr_date).format(
        "YYYY-MM-DD"
      )}&enddate=${moment(curr_date).format("YYYY-MM-DD")}`
    );

    if (!res.ok) {
      const errorData = await res.json();
      setinventoryData({
        error: true,
        errMessage: errorData?.message,
        errStatus: res.status,
        errStatusText: res.statusText,
        errDetail: JSON.stringify(errorData?.error, null, 2),
      });
      setisLoading(false);
      return;
    }

    const data = await res.json();
    setinventoryData(data);
    setisLoading(false);
  }, [searchParams, curr_date, plant]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 1000 * 5);

    return () => {
      clearInterval(interval);
    };
  }, [fetchData]);

  useEffect(() => {
    setisLoading(true);
    fetchData();
  }, [plant, fetchData]);

  if ((inventoryData as ErrorRes).error) {
    const errData = inventoryData as ErrorRes;
    return (
      <Alert variant="destructive" className="overflow-y-auto row-span-2">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>
          Error {`<${errData.errStatus}> : ${errData.errStatusText}`}
        </AlertTitle>
        <AlertDescription>
          {errData.errMessage}
          <br />
          <pre className="whitespace-pre-line">
            {JSON.stringify(errData.errDetail, null, 2)}
          </pre>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      {/* Inbound Card */}
      <Card className="border-0 rounded-md h-full flex flex-col bg-white bg-opacity-5 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-haier-text-gray">
            <span className="text-md">Today Inbound</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="h-3/4 flex flex-col justify-center items-center">
          {isLoading ? (
            <ImSpinner2 className="animate-spin text-blue-600" size={30} />
          ) : (
            <article>
              <Counter
                start={0}
                end={(inventoryData as inventoryInOutType[])[0]?.inbound_qty}
                duration={1000}
              />
            </article>
          )}
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
      {/* Outbound Card */}
      <Card className="border-0 rounded-md h-full flex flex-col bg-white bg-opacity-5 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-haier-text-gray">
            <span className="text-md">Today Outbound</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="h-3/4 flex flex-col justify-center items-center">
          {isLoading ? (
            <ImSpinner2 className="animate-spin text-blue-600" size={30} />
          ) : (
            <article>
              <Counter
                start={0}
                end={(inventoryData as inventoryInOutType[])[0]?.outbound_qty}
                duration={1000}
              />
            </article>
          )}
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </>
  );
};

export default NumberCard;
