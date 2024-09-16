import moment from "moment";

const API_URL = process.env.API_URL;

export async function fetchInventoryCurrentDate(plant: string) {
  "use server";
  console.log('fetching inventory curr date...')
  const curr_date = moment().format("YYYY-MM-DD");
  const res = await fetch(
    `${API_URL}/api/inventory?startdate=${curr_date}&enddate=${curr_date}&plant=${plant}`,
    { cache: "no-cache" }
  );

  if (!res.ok) {
    return {
      error: true,
      errMessage: "Failed to fetch inventory data!",
      errStatus: res.status,
      errStatusText: res.statusText,
    };
  }

  let inventoryCurrDate = await res.json();
  return inventoryCurrDate;
}

export async function fetchInventoryInOut(
  startdate: string,
  enddate: string,
  plant: string
) {
  "use server";
  const res = await fetch(
    `${API_URL}/api/inventory?startdate=${startdate}&enddate=${enddate}&plant=${plant}`,
    { next: { revalidate: 60 } }
  );

  if (res.status !== 200) {
    const errorData = await res.json();
    return {
      error: true,
      errMessage: errorData.message,
      errStatus: res.status,
      errStatusText: res.statusText,
      errDetail: errorData.error,
    };
  }

  return await res.json();
}
