"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip as Tooltips,
} from "@/components/ui/tooltip";
import { BsInfoCircle } from "react-icons/bs";
import { AccumCompRateType, CompleteRateI } from "./CompletePendingCompoment";
import PendingjobLoading from "./PendingjobLoading";

type PendingJobType = {
  plan_qty: number;
  actual_qty: number;
  comp_rate: CompleteRateI[];
};



type Props = {
  isRelateSelectDate: boolean;
  startdate: string | null;
  enddate: string | null;
  handleSwitchChange: () => void;
  isLoading: boolean;
  pendingJobData?: PendingJobType;
  title: string;
  description: string;
  accum_comp_rate?: AccumCompRateType;
};

const Accum = ({
  isRelateSelectDate,
  startdate,
  enddate,
  handleSwitchChange,
  isLoading,
  pendingJobData,
  title,
  description,
  accum_comp_rate,
}: Props) => {
  return (
    <div className="col-span-1">
      <Card className="bg-background text-haier-text-gray h-full">
        <CardHeader className="flex justify-between">
          <div>
            <CardTitle className="flex justify-between w-full">
              <p>{title}</p>
              <TooltipProvider>
                <Tooltips>
                  <TooltipTrigger>
                    <BsInfoCircle size={18} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {isRelateSelectDate
                        ? `${description} of Plan date`
                        : `${description} of Yesterday`}
                    </p>
                  </TooltipContent>
                </Tooltips>
              </TooltipProvider>
            </CardTitle>
            <CardDescription>
              Of{" "}
              {isRelateSelectDate ? `${startdate} - ${enddate}` : `Yesterday`}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="relate-date"
              style={{ padding: 0 }}
              checked={isRelateSelectDate}
              onClick={handleSwitchChange}
              className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
            />
            <Label htmlFor="relate-date">Relate selected date</Label>
          </div>
        </CardHeader>
        {isLoading ? (
          <PendingjobLoading />
        ) : (
          <CardContent className="flex flex-col font-semibold text-xl 2xl:text-4xl gap-3">
            <div className="flex gap-2">
              <div className="w-full text-center h-full flex flex-col justify-center items-center bg-blue-600 bg-opacity-10 rounded-md 2xl:py-10 py-2">
                <h2>
                  {pendingJobData
                    ? pendingJobData.plan_qty
                    : accum_comp_rate?.plan_qty}
                </h2>
                <p className="text-sm 2xl:text-lg">Plan</p>
              </div>
              <div className="w-full text-center h-full flex flex-col justify-center items-center bg-blue-600 bg-opacity-10 rounded-md 2xl:py-10 py-2">
                <h2>
                  {pendingJobData
                    ? pendingJobData.actual_qty
                    : accum_comp_rate?.act_qty}
                </h2>
                <p className="text-sm 2xl:text-lg">Offline</p>
              </div>
            </div>
            <div className="w-full text-center h-full flex justify-center items-center bg-blue-600 bg-opacity-10 rounded-md 2xl:py-7 py-2">
              <h2>
                {pendingJobData
                  ? pendingJobData.plan_qty === 0
                    ? 0
                    : (
                        (pendingJobData?.actual_qty /
                          pendingJobData?.plan_qty) *
                        100
                      ).toFixed(2)
                  : accum_comp_rate?.rate}
                %
              </h2>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default Accum;
