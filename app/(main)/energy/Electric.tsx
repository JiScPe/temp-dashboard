"use client";

import { iElecWAC, iPEA } from "@/app/types/energy-type";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import PEA from "./PEA";
import ElecWAC from "./ElecWAC";

type Props = {
  pea_data: iPEA[];
  pea_data_err: {
    error: boolean;
    message: string;
    errResponse: any;
  };
  elec_data: iElecWAC[];
  elec_data_err: {
    elec_error: boolean;
    elec_message: string;
    elec_errResponse: any;
  };
};

export default function Electic({
  pea_data,
  pea_data_err,
  elec_data,
  elec_data_err,
}: Props) {
  const { toast } = useToast();
  const { error, message, errResponse } = pea_data_err;
  const { elec_error, elec_message, elec_errResponse } = elec_data_err;
  const [reportToggle, setreportToggle] = useState<string>("factory");

  function handleToastActionClick(errRes: any) {
    navigator.clipboard.writeText(JSON.stringify(errRes));
  }

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: message,
        action: (
          <ToastAction
            altText="CopyError"
            onClick={() => handleToastActionClick(errResponse)}
          >
            CopyError
          </ToastAction>
        ),
      });
    } else if (elec_error) {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: elec_message,
        action: (
          <ToastAction
            altText="CopyError"
            onClick={() => handleToastActionClick(elec_errResponse)}
          >
            CopyError
          </ToastAction>
        ),
      });
    }
  }, [
    pea_data,
    pea_data_err,
    elec_data,
    elec_data_err,
    elec_errResponse,
    elec_error,
    elec_message,
    errResponse,
    error,
    message,
    toast,
  ]);

  if (error || elec_error) {
    return (
      <div className="col-span-3 row-span-2 text-white">Error! No data.</div>
    );
  }

  if (reportToggle === "factory") {
    return (
      <PEA
        pea_data={pea_data}
        toggle={reportToggle}
        settoggle={setreportToggle}
      />
    );
  } else {
    return (
      <ElecWAC
        elec_data={elec_data}
        toggle={reportToggle}
        settoggle={setreportToggle}
      />
    );
  }
}
