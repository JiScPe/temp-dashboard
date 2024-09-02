import { connect78webservices } from "@/app/lib/db-util";
import { getOneWhitelistReq } from "@/app/lib/helpers/whitelist";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params: { id } }: { params: { id: string } }
) {
  let _78webservices;
  try {
    _78webservices = await connect78webservices();
    _78webservices.connect();

    const [rows]: any = await getOneWhitelistReq(_78webservices, id);

    return NextResponse.json({ rows }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: `Something went wrong!, Please contact administator`, error },
      { status: 500 }
    );
  }
}
