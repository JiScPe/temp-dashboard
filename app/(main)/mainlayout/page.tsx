import React from "react";
import MainLayout from "./MainLayout";

type Props = {
  searchParams: {
    plant: string | null;
    prod_line: string | null;
  };
};

async function getIdleTime(plant: string | null, prod_line: string | null) {
  "use server";
  const API_URL: string | undefined = process.env.API_URL;
  console.log("fetching idle time data...");
  console.log(`API: ${API_URL}`);

  const data = await fetch(
    `${API_URL}/api/mainlayout?plant=${plant}&prod_line=${prod_line}`,
    { cache: "no-cache" }
  );

  if (!data.ok) {
    console.log(`Error fail to fetch data: ${data.status} ${data.statusText}`);
    return [];
  }

  let idleTimeData = await data.json();
  return idleTimeData;
}

const MainLayoutPage = async ({ searchParams }: Props) => {
  const { plant, prod_line } = searchParams;

  const data = await getIdleTime(plant, prod_line);
  return <MainLayout data={data} getIdleTime={getIdleTime} />;
};

export default MainLayoutPage;
