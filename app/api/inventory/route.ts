import { connectWMS9771Database } from "@/app/lib/db-util";
import { getInventoryInOut } from "@/app/lib/helpers/getInventoryInOut";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const startdate = url.searchParams.get("startdate");
  const enddate = url.searchParams.get("enddate");
  const plant = url.searchParams.get("plant");

  if (!startdate || !enddate) {
    return NextResponse.json(
      { message: "กรุณาใส่วันที่เริ่มต้นและสิ้นสุด" },
      { status: 400 }
    );
  }

  if (!plant) {
    return NextResponse.json({ message: "กรุณาใส่ plant!" }, { status: 400 });
  }

  let connect_wms_db: any;
  try {
    connect_wms_db = await connectWMS9771Database();
    connect_wms_db.connect();

    const [row]: any = await getInventoryInOut(
      connect_wms_db,
      startdate,
      moment(enddate).add(1, "day").format("YYYY-MM-DD"),
      plant
    );
    return NextResponse.json(row, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Database connection failed!", error },
      { status: 500 }
    );
  } finally {
    connect_wms_db?.destroy();
  }
}
