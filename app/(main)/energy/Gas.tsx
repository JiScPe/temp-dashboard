"use client";
import { iGas } from "@/app/types/energy-type";
import React, { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { ExtractVal } from "@/app/lib/utility/extractword";

type Props = {
  gas_data: iGas[];
  gas_data_err: {
    error: boolean;
    message: string;
    errResponse: any;
  };
  getGas_data: () => Promise<void>;
};

Chart.register(ArcElement, Tooltip, Legend);

const Gas = ({ gas_data, gas_data_err, getGas_data }: Props) => {
console.log("gas_data: ", gas_data);
  const { toast } = useToast();
  const [newdata, setnewdata] = useState(gas_data || []);
  const { error, message, errResponse } = gas_data_err;
  const GasLevelData = gas_data.filter(
    ({ dataChannelDescription }) =>
      dataChannelDescription.toLowerCase() === "level"
  );
  // Oxygen data
  const oxyData = GasLevelData.find(
    (item) => item.productDescription === "LOX"
  );
  const oxyValue: number = oxyData?.scaledReading || 0;
  console.log(oxyData?.scaledAlarmLevels);
  const oxyFull: number = ExtractVal(oxyData?.scaledAlarmLevels || "", "full");
  const oxyRe: number = ExtractVal(oxyData?.scaledAlarmLevels || "", "reorder");
  const oxyCri: number = ExtractVal(
    oxyData?.scaledAlarmLevels || "",
    "critical"
  );
  // Nitrogen Data
  const nitrogenData = GasLevelData.find(
    (item) => item.productDescription === "LIN"
  );
  const nitrogenValue: number = nitrogenData?.scaledReading || 0;
  console.log(nitrogenData?.scaledAlarmLevels);
  const nitrogenFull: number = ExtractVal(
    nitrogenData?.scaledAlarmLevels || "",
    "full"
  );
  const nitrogenRe: number = ExtractVal(
    nitrogenData?.scaledAlarmLevels || "",
    "reorder"
  );
  const nitrogenCri: number = ExtractVal(
    nitrogenData?.scaledAlarmLevels || "",
    "critical"
  );
  const chartRef = useRef<any>(null);
  const [gradient, setGradient] = useState<CanvasGradient | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.ctx;
      const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
      gradient.addColorStop(0, "#FF3526"); // Start color (orange)
      gradient.addColorStop(0.5, "#FFA526"); // End color (green)
      gradient.addColorStop(1, "#66BB6A"); // End color (green)
      setGradient(gradient);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const data: any = await getGas_data();
      const updateData = data.rows;
      setnewdata(updateData);
    }, 1000 * 60 * 5);

    return () => clearInterval(interval);
  }, [getGas_data]);

  const data: any = {
    datasets: [
      {
        data: [oxyValue, oxyFull - oxyValue],
        backgroundColor: [gradient, "#969696"],
        borderWidth: 0,
        cutout: "85%",
        rotation: -90,
        circumference: 180,
        borderRadius: [10, 0],
      },
    ],
  };
  const nitrogendata: any = {
    datasets: [
      {
        data: [nitrogenValue, nitrogenFull - nitrogenValue],
        backgroundColor: [gradient, "#969696"],
        borderWidth: 0,
        cutout: "85%",
        rotation: -90,
        circumference: 180,
        borderRadius: [10, 0],
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: false,
      },
    },
    rotation: -90,
    circumference: 180,
  };

  function handleToastActionClick() {
    navigator.clipboard.writeText(JSON.stringify(errResponse));
  }

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: message,
        action: (
          <ToastAction altText="CopyError" onClick={handleToastActionClick}>
            CopyError
          </ToastAction>
        ),
      });
    }
  }, [newdata, error, handleToastActionClick, message, toast]);

  if (error) {
    return (
      <div className="col-span-3 row-span-2 text-white">Error! No data.</div>
    );
  }

  return (
    <>
      <Card className="relative bg-opacity-5 bg-white backdrop-blur-md text-white flex flex-col gap-0 justify-center h-[250px] 2xl:h-[400px]">
        <CardHeader className="text-center">
          <CardTitle>
            Oxygen{" "}
            <span className="text-sm">{`(${oxyData?.displayUnits})`}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Doughnut ref={chartRef} data={data} options={options} />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, 50%)",
              textAlign: "center",
            }}
          >
            <p>
              {oxyValue < oxyCri
                ? "Critical"
                : oxyValue < oxyRe
                ? "ReOrder"
                : "Normal"}
            </p>
            <h2 className="m-0 text-3xl font-semibold">{oxyValue}</h2>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col mx-5 2xl:mx-10 gap-5 text-haier-text-gray">
          <div className="flex justify-between w-full">
            <CardTitle>0</CardTitle>
            <CardTitle>{oxyFull}</CardTitle>
          </div>
          <CardDescription>
            Critical: {oxyCri} Reorder: {oxyRe} Full: {oxyFull}
          </CardDescription>
        </CardFooter>
      </Card>
      <Card className="relative bg-opacity-5 bg-white backdrop-blur-md text-white flex flex-col gap-0 justify-center h-[250px] 2xl:h-[400px]">
        <CardHeader className="text-center">
          <CardTitle>
            Nitrogen{" "}
            <span className="text-sm">{`(${nitrogenData?.displayUnits})`}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Doughnut ref={chartRef} data={nitrogendata} options={options} />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, 50%)",
              textAlign: "center",
            }}
          >
            <p>
              {nitrogenValue < nitrogenCri
                ? "Critical"
                : nitrogenValue < nitrogenRe
                ? "ReOrder"
                : "Normal"}
            </p>
            <h2 className="m-0 text-3xl font-semibold">{nitrogenValue}</h2>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col mx-5 2xl:mx-10 gap-5 text-haier-text-gray">
          <div className="flex justify-between w-full">
            <CardTitle>0</CardTitle>
            <CardTitle>{nitrogenFull}</CardTitle>
          </div>
          <CardDescription>
            Critical: {nitrogenCri} Reorder: {nitrogenRe} Full: {nitrogenFull}
          </CardDescription>
        </CardFooter>
      </Card>
    </>
  );
};
export default Gas;
