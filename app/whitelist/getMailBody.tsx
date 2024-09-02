type Props = {
  materialList: string[];
  reason: string;
  requestor: string;
  id: string;
};

let str: string;

function renderMaterial(materialList: string[], type: "list" | "string") {
  str = "";
  materialList.forEach((item, idx) => {
    if (type === "list") {
      str += `<li>${item}</li>`;
    } else {
      if (idx === materialList.length - 1) {
        str += item;
      } else {
        str += `${item},`;
      }
    }
  });
  return str;
}

export function getMailBody({ materialList, reason, requestor, id }: Props) {
  const API_URL: string = process.env.API_URL || "http://localhost:5500";

  return `<article>
      <h1>Material WhiteList Request | #${id}</h1>
      <ul>${renderMaterial(materialList, "list")}</ul>
      <p><strong>Reason:</strong> ${reason.toString()}</p>
      <p><strong>Requestor:</strong> ${requestor.toString()}</p>
      <span style="background-color: #065aa8; padding: 10px; margin-right: 5px; border-radius: 5px"><a href="${API_URL}/api/whitelist-approve/${id}" style="text-decoration: none; color: white">Approve</a></span>
      <span style="background-color: #a80606; padding: 10px; margin-right: 5px; border-radius: 5px"><a href="${API_URL}/api/whitelist-reject/${id}" style="text-decoration: none; color: white">Reject</a></span>
  </article>`;
}

export function getApproveMailBody(id: string) {
  const API_URL: string = process.env.API_URL || "http://localhost:5500";
  return `<article>
  <h1>Material WhiteList Request | #${id} has been Approved!</h1>
  <a href="${API_URL}/whitelist/${id}">Go to Whitelist request</a>
</article>`;
}

export function getRejectMailBody(id: string) {
  const API_URL: string = process.env.API_URL || "http://localhost:5500";
  return `<article>
  <h1>Material WhiteList Request | #${id} has been Rejected!</h1>
  <a href="${API_URL}/whitelist/${id}">Go to Whitelist request</a>
</article>`;
}
