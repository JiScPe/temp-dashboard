import { connect78database } from "@/app/lib/db-util";
import { getGas_Data } from "@/app/lib/helpers/getGas";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  let db78_connection: any;

  try {
    db78_connection = await connect78database();
    db78_connection.connect();

    const [rows]: any = await getGas_Data(db78_connection);
    return NextResponse.json({ rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Something went wrong!",
      },
      { status: 500 }
    );
  } finally {
    db78_connection?.destroy();
  }
}
