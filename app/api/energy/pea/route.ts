import { connect78database } from "@/app/lib/db-util";
import { getPEA_Data } from "@/app/lib/helpers/getPEA";
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

  let db78_connection: any;

  try {
    db78_connection = await connect78database();
    db78_connection.connect();

    const [rows]: any = await getPEA_Data(db78_connection, startdate, enddate);
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
    db78_connection?.destroy();
  }
}
