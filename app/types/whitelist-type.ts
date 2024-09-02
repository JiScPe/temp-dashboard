export type WhitelistReqType = {
  id: string;
};

export type WhitelistDataType = {
  id: string;
  plant: string;
  requestor: string;
  material: string;
  reason: string;
  status: "Wait for approve" | "Approved" | "Rejected";
  approver: string;
  created_at: string;
  updated_at: string;
  message?: string
};
