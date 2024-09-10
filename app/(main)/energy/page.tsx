import React, { Suspense } from "react";
import RedirectNavbar from "../../components/RedirectNavbar";
import PEA from "./Electric";
import Gas from "./Gas";
import Electic from "./Electric";

type Props = { searchParams: { startdate: string; enddate: string } };

async function getPEA_data(startdate: string, enddate: string) {
  const API_URL: string = process.env.API_URL || "http://localhost:5500";
  const res = await fetch(
    `${API_URL}/api/energy/pea?startdate=${startdate}&enddate=${enddate}`,
    { cache: "no-cache" }
  );

  if (!res.ok) {
    return {
      error: true,
      message: "Failed to fetch PEA data.",
      errResponse: await res.json(),
    };
  }

  return await res.json();
}

async function getElecWAC(startdate: string, enddate: string) {
  const API_URL: string = process.env.API_URL || "http://localhost:5500";
  const res = await fetch(
    `${API_URL}/api/energy/elec-wac?startdate=${startdate}&enddate=${enddate}`,
    { cache: "no-cache" }
  );

  if (!res.ok) {
    return {
      error: true,
      message: "Failed to fetch Electric consumtion data!",
      errResponse: await res.json(),
    };
  }

  return await res.json();
}

async function getGas_data() {
  "use server";
  const API_URL: string = process.env.API_URL || "http://localhost:5500";
  console.log("fetching gas data...");

  const res = await fetch(`${API_URL}/api/energy/gas`, { cache: "no-cache" });
  if (!res.ok) {
    return {
      error: true,
      message: "Failed to fetch gas data.",
      errResponse: await res.json(),
    };
  }
  const { rows }: any = await res.json();
  return rows;
}

const EnergyPage = async ({ searchParams }: Props) => {
  const { startdate, enddate } = searchParams;
  const pea_data = await getPEA_data(startdate, enddate);
  const gas_data = await getGas_data();
  const elec_data = await getElecWAC(startdate, enddate);
  return (
    <main>
      <RedirectNavbar
        url={`/energy`}
        startdate={new Date(startdate)}
        enddate={new Date(enddate)}
      />
      <div className="grid grid-cols-4 grid-rows-2 gap-5 p-5 w-11/12 mx-auto mt-3">
        <Suspense fallback={<p>loading PEA data...</p>}>
          <Electic
            pea_data={pea_data.rows}
            pea_data_err={pea_data}
            elec_data={elec_data.rows}
            elec_data_err={elec_data}
          />
        </Suspense>
        <Gas
          gas_data={gas_data}
          gas_data_err={gas_data}
          getGas_data={getGas_data}
        />
      </div>
    </main>
  );
};

export default EnergyPage;
