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
  // console.log("fetching data...");
  const { row } = await fetch(
    `${API_URL}/api/mainlayout?plant=${plant}&prod_line=${prod_line}`,
    { cache: "no-cache" }
  ).then((res) => res.json());

  if (!row) {
    return [];
  }

  return row;
}

const MainLayoutPage = async ({ searchParams }: Props) => {
  const { plant, prod_line } = searchParams;

  const data = await getIdleTime(plant, prod_line);
  // console.log(data.length);
  return <MainLayout data={data} getIdleTime={getIdleTime} />;
};

export default MainLayoutPage;
