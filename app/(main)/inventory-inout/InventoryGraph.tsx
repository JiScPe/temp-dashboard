"use client";
import { useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { ECOption } from "@/app/types/chart-type";
import EChartComponent from "@/app/components/EChartComponent";
import EChartInventory from "@/app/components/EChartInventory";
import { ErrorRes, inventoryInOutType } from "@/app/types/inven-inout-type";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const InventoryGraph = () => {
  const searchParams = useSearchParams();
  const startdate = searchParams.get("startdate");
  const enddate = searchParams.get("enddate");
  const plant = searchParams.get("plant");

  const [chartData, setchartData] = useState<inventoryInOutType[] | ErrorRes>(
    []
  );
  const [isLoading, setisLoading] = useState(false);

  const fetchInventoryData = useCallback(async () => {
    setisLoading(true);
    const res = await fetch(
      `/api/inventory?plant=${plant}&startdate=${startdate}&enddate=${enddate}`
    );

    if (!res.ok) {
      const errorData = await res.json();
      setchartData({
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
    setchartData(data);
    setisLoading(false);
  }, [startdate, enddate, plant]);

  useEffect(() => {
    fetchInventoryData();
  }, [fetchInventoryData]);

  if ((chartData as ErrorRes).error) {
    const errData = chartData as ErrorRes;
    return (
      <Alert variant="destructive" className="overflow-y-auto row-span-2">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>
          Error {`<${errData.errStatus}> : ${errData.errStatusText}`}
        </AlertTitle>
        <AlertDescription>
          {errData.errMessage}
          <br />
          <pre>{errData.errDetail}</pre>
        </AlertDescription>
      </Alert>
    );
  }

  const categories = (chartData as inventoryInOutType[]).map(
    ({ transaction_date }: any) => transaction_date
  );
  const inbound_qty = (chartData as inventoryInOutType[]).map(
    ({ inbound_qty }: any) => inbound_qty
  );
  const outbound_qty = (chartData as inventoryInOutType[]).map(
    ({ outbound_qty }: any) => outbound_qty
  );

  const inventoryOption: ECOption = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["Inbound Qty", "Outbound Qty"],
      top: 0,
      textStyle: {
        color: "#9cbbd7",
        fontSize: 18,
      },
    },
    xAxis: [
      {
        type: "category",
        data: categories,
        axisLabel: {
          fontSize: 16,
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "Qty",
        position: "left",
        axisLabel: {
          fontSize: 16,
        },
        splitLine: {
          lineStyle: {
            color: "#244668",
          },
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
        name: "Inbound Qty",
        type: "bar",
        data: inbound_qty,
        label: {
          show: true,
          position: "outside",
          color: "#97a2b5",
          fontSize: 12,
        },
        itemStyle: {
          color: "#548bf3",
          borderRadius: [5, 5, 0, 0],
        },
        barWidth: (chartData as inventoryInOutType[]).length > 21 ? 10 : 33,
      },
      {
        name: "Outbound Qty",
        type: "bar",
        data: outbound_qty,
        label: {
          show: true,
          position: "top",
          color: "#97a2b5",
          fontSize: 12,
        },
        itemStyle: {
          color: "#40f4ec",
          borderRadius: [5, 5, 0, 0],
        },
        barWidth: (chartData as inventoryInOutType[]).length > 21 ? 10 : 33,
      },
    ],
    textStyle: {
      color: "#9cbbd7",
      fontSize: 16,
    },
  };

  return (
    <div>
      {isLoading && (
        <div className="h-[calc(100vh-80px)] overflow-auto w-full text-blue-600 flex flex-col justify-center items-center">
          <ImSpinner2 className="animate-spin" size={30} />
          <p>loading...</p>
        </div>
      )}
      <EChartInventory chartOption={inventoryOption} />
    </div>
  );
};

export default InventoryGraph;
