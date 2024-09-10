import { connect78database } from "@/app/lib/db-util";
import { getWACElec } from "@/app/lib/helpers/getWACElec";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const startdate = url.searchParams.get("startdate");
  const enddate = url.searchParams.get("enddate");

  if (!startdate || !enddate) {
    return NextResponse.json(
      { message: "กรุณาใส่วันที่เริ่มต้นและสิ้นสุด" },
      { status: 400 }
    );
  }

  let _78dbconnection: any;
  try {
    _78dbconnection = await connect78database();
    _78dbconnection.connect();

    const [rows]: any = await getWACElec(_78dbconnection, startdate, enddate);
    return NextResponse.json({ rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong!. Please contact administrator",
        error,
      },
      { status: 500 }
    );
  } finally {
    _78dbconnection?.destroy();
  }
}
