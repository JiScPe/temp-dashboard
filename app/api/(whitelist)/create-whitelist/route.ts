import { connect78webservices } from "@/app/lib/db-util";
import { createWhitelist } from "@/app/lib/helpers/whitelist";
import { generateRandomKey } from "@/app/lib/utility/genKey";
import { NextRequest, NextResponse } from "next/server";

type WhiteListReqBody = {
  id?: string;
  requestor: string;
  material: string;
  reason: string;
};

// CREATE
export async function POST(req: NextRequest) {
  let connect78db, id, status;
  let reqbody = await req.json();
  const { requestor, material, reason }: WhiteListReqBody = reqbody;
  id = generateRandomKey();

  try {
    connect78db = await connect78webservices();
    connect78db.connect();

    const [result, field]: any = await createWhitelist(
      connect78db,
      id,
      requestor,
      material,
      reason,
    );
    return NextResponse.json(
      {
        message: `Create whitelist request successfully! with ID: ${id}`,
        id,
        result,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Create whitelist failed!", error },
      { status: 500 }
    );
  } finally {
    connect78db?.destroy();
  }
}

// Read many, all
// Read one, id
// Update, id
// Delete, id
