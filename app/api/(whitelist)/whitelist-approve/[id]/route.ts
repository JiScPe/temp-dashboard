import { connect78webservices } from "@/app/lib/db-util";
import {
  getOneWhitelistReq,
  updateWhitelistReq,
} from "@/app/lib/helpers/whitelist";
import { mailBodyI } from "@/app/types/mail-type";
import { getApproveMailBody } from "@/app/whitelist/getMailBody";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  let _78webservices = await connect78webservices();
  _78webservices.connect();

  //get material data
  const [rows]: any = await getOneWhitelistReq(_78webservices, params.id);
  const material = rows[0].material;
  const requestor_email = rows[0].requestor;
  // update status
  const updateObj = {
    id: params.id,
    status: "Approved",
    updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
  };

  try {
    const [updateRes] = await updateWhitelistReq(
      _78webservices,
      params.id,
      updateObj
    );

    const materialArr = material?.replaceAll(" ", "").split(",");
    const res = await fetch(
      "https://gmdc.haier.net/gims/api/tBillLocalSendMain/addMaterialWhitelist",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Entrance: "thailand",
          Cookie:
            "INGRESSCOOKIE=f9412ef21c69ed9b0243c6fd4108d63f|3cdfe95961407725ba10481251dd3197",
        },
        body: JSON.stringify(materialArr),
      }
    );
    const whitelist_res = await res.json();

    const htmlMail = getApproveMailBody(params.id);
    const sendApprovedMailBody: mailBodyI = {
      mailTo: requestor_email,
      mailCc: "",
      subject: "Your Material Whitelist Request has been Approved",
      html: htmlMail,
    };

    const sendmail_res = await fetch(
      "http://10.35.10.47:2003/api/MailServices/MailService",
      {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendApprovedMailBody),
      }
    );

    return NextResponse.json({ updateRes, whitelist_res, sendmail_res }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Update whitelist req status failed!", error },
      { status: 500 }
    );
  }
}
