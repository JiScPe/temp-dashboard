import { connect78webservices } from "@/app/lib/db-util";
import {
  getOneWhitelistReq,
  updateWhitelistReq,
} from "@/app/lib/helpers/whitelist";
import { mailBodyI } from "@/app/types/mail-type";
import { getRejectMailBody } from "@/app/whitelist/getMailBody";
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
    status: "Rejected",
    updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
  };

  try {
    const [updateRes] = await updateWhitelistReq(
      _78webservices,
      params.id,
      updateObj
    );

    const htmlMail = getRejectMailBody(params.id);
    const sendRejectedMailBody: mailBodyI = {
      mailTo: requestor_email,
      mailCc: "",
      subject: "Your Material Whitelist Request has been Rejected",
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
        body: JSON.stringify(sendRejectedMailBody),
      }
    );

    return NextResponse.json({ updateRes, sendmail_res }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Update whitelist req status failed!", error },
      { status: 500 }
    );
  }
}
