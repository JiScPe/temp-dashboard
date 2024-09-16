export type inventoryInOutType = {
  transaction_date: string;
  inbound_qty: number;
  inbound_qty_post_success: number;
  inbound_qty_post_failed: number;
  outbound_qty: number;
};

export type ErrorRes = {
  error: boolean;
  errStatus: number;
  errStatusText: string;
  errMessage: string;
  errDetail: any;
};
