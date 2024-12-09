import { connectMESdatabase } from "@/app/lib/db-util";
import { getPendingJob } from "@/app/lib/helpers/getPendingjob";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  let connectMESdb: any;

  const url = new URL(req.url);
  const plant = url.searchParams.get("plant");
  const linecode = url.searchParams.get("linecode");
  const isRelatedDate = url.searchParams.get("related");
  const startdate = url.searchParams.get("startdate");
  const enddate = url.searchParams.get("enddate");

  if (!plant) {
    return NextResponse.json({ message: "กรุณาใส่ plant!" }, { status: 400 });
  }
  if (!linecode) {
    return NextResponse.json(
      { message: "กรุณาใส่ production line!" },
      { status: 400 }
    );
  }
  if (isRelatedDate === 'true') {
    if (!startdate || !enddate) {
      return NextResponse.json(
        { message: "กรุณาใส่วันที่เริ่มต้นและสิ้นสุด!" },
        { status: 400 }
      );
    }
  }

  try {
    connectMESdb = await connectMESdatabase();
    connectMESdb.connect();

    const [rows]: any = await getPendingJob(
      connectMESdb,
      plant,
      linecode,
      isRelatedDate || "false",
      startdate,
      enddate
    );
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Somethind went wrong!", error },
      { status: 500 }
    );
  } finally {
    connectMESdb.destroy();
  }
}
