import { connectMESdatabase } from "@/app/lib/db-util";
import {
  getOfflineCompleteRate,
  getPlanCompletRate,
} from "@/app/lib/helpers/getPlanCompleteRate";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

type Data = {
  date: string; // "YYYY-MM-DD" format
  act_qty?: number;
  plan_qty?: number;
};

// Normalize the dates and merge the arrays
const mergeData = (offline: Data[], plan: Data[]): Data[] => {
  const dateMap: { [key: string]: Data } = {};

  // Normalize offline data dates and add to map
  offline.forEach(({ date, act_qty }) => {
    const normalizedDate = moment(date).format("YYYY-MM-DD");
    dateMap[normalizedDate] = {
      date: normalizedDate,
      act_qty: act_qty || 0,
      plan_qty: 0,
    };
  });

  // Normalize plan data dates and merge
  plan.forEach(({ date, plan_qty }) => {
    const normalizedDate = moment(date).format("YYYY-MM-DD");
    if (dateMap[normalizedDate]) {
      dateMap[normalizedDate].plan_qty = plan_qty || 0;
    } else {
      dateMap[normalizedDate] = {
        date: normalizedDate,
        act_qty: 0,
        plan_qty: plan_qty || 0,
      };
    }
  });
  // Convert map to array
  return Object.values(dateMap);
};

const calculateRate = (mergedData: Data[]): Data[] => {
  return mergedData
    .map((entry) => {
      const { act_qty = 0, plan_qty = 0 } = entry;

      // Calculate rate safely to avoid division by 0
      const rate = plan_qty > 0 ? (act_qty / plan_qty) * 100 : 0;

      // Return a new object with the rate added
      return {
        ...entry,
        rate: parseFloat(rate.toFixed(2)), // Round to 2 decimal places
      };
    });
};

export async function GET(req: NextRequest) {
  let connectMESdb: any;

  const url = new URL(req.url);
  const plant = url.searchParams.get("plant");
  const linecode = url.searchParams.get("linecode");
  const startdate =
    url.searchParams.get("startdate") ||
    moment().add(-7, "days").format("YYYY-MM-DD");
  const enddate =
    url.searchParams.get("enddate") || moment().format("YYYY-MM-DD");

  if (!plant) {
    return NextResponse.json({ message: "กรุณาใส่ plant!" }, { status: 400 });
  }
  if (!linecode) {
    return NextResponse.json(
      { message: "กรุณาใส่ production line!" },
      { status: 400 }
    );
  }

  try {
    connectMESdb = await connectMESdatabase();
    connectMESdb.connect();
    let last_enddate;
    if (moment(enddate) > moment()) {
      last_enddate = moment().format("YYYY-MM-DD");
    } else {
      last_enddate = enddate;
    }
    const [pln_data]: any = await getPlanCompletRate(
      connectMESdb,
      plant,
      linecode,
      startdate,
      last_enddate
    );
    const [act_data]: any = await getOfflineCompleteRate(
      connectMESdb,
      plant,
      linecode,
      startdate,
      last_enddate
    );

    // Merge the data
    const mergedData = mergeData(act_data, pln_data);
    // mergedDataWithRate
    const mergedDataWithRate = calculateRate(mergedData);

    return NextResponse.json(mergedDataWithRate, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Somethind went wrong!", error },
      { status: 500 }
    );
  } finally {
    connectMESdb.destroy();
  }
}
