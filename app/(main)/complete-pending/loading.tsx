"use client";
import RedirectNavbar from "@/app/components/RedirectNavbar";
import React from "react";

const loading = () => {
  return (
    <main>
      <RedirectNavbar
        plant={"9771"}
        linecode={"RA"}
        startdate={new Date()}
        enddate={new Date()}
        url={""}
      />
      <div className="grid grid-cols-4 m-5 gap-5">
        <div className="col-1 flex flex-col min-h-full"></div>
      </div>
    </main>
  );
};

export default loading;
