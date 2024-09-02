import { WhitelistDataType } from "@/app/types/whitelist-type";
import { message } from "antd";
import moment from "moment";
import React from "react";

const API_URL = process.env.API_URL;

const fetchWhitelist = async (id: string) => {
  console.log("fetching single whitelist data");
  console.log(`API: ${API_URL}`);
  const res = await fetch(`${API_URL}/api/whitelist/${id}`, {
    cache: "no-cache",
  });

  if (!res.ok) {
    return { message: "No data" };
  }

  return res.json();
};

const page = async ({ params }: { params: { id: string } }) => {
  const { rows } = await fetchWhitelist(params.id);
  console.log(rows);
  if (rows.length < 1) {
    return (
      <main className="bg-[#065aa8] text-black h-screen w-full flex items-center">
        <div className="w-4/5 xl:w-3/5 2xl:w-2/5 mx-auto p-7 bg-white backdrop-blur-md rounded-md gap-2 text-[#2f353b] shadow-xl">
          <h1 className="text-center font-bold text-xl mb-5">
            Material Whitelist Request ID: <strong>{params.id}</strong>
          </h1>
          <p>No data.</p>
        </div>
      </main>
    );
  }
  const whitelist_res = rows[0];
  const {
    id,
    plant,
    requestor,
    material,
    reason,
    status,
    approver,
    created_at,
  }: WhitelistDataType = whitelist_res;
  return (
    <main className="bg-[#065aa8] text-black h-screen w-full flex items-center">
      <div className="w-4/5 xl:w-3/5 2xl:w-2/5 mx-auto p-7 bg-white backdrop-blur-md rounded-md gap-2 text-[#2f353b] shadow-xl">
        <h1 className="text-center font-bold text-xl mb-5">
          Material Whitelist Request ID: <strong>{id}</strong>
        </h1>
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <label htmlFor="plant">Plant:</label>
            <p className="text-sm">{plant}</p>
          </div>
          <div className="flex gap-3">
            <label htmlFor="plant">Material:</label>
            <p className="text-sm">{material}</p>
          </div>
          <div className="flex gap-3">
            <label htmlFor="plant">Requestor:</label>
            <p className="text-sm">{requestor}</p>
          </div>
          <div className="flex gap-3">
            <label htmlFor="plant">Reason:</label>
            <p className="text-sm">{reason}</p>
          </div>
          <div className="flex gap-3">
            <label htmlFor="plant">Status:</label>
            <p
              className={`text-sm ${
                status === "Wait for approve"
                  ? "text-yellow-600"
                  : status === "Approved"
                  ? "text-emerald-600"
                  : "text-rose-600"
              }`}
            >
              {status}
            </p>
          </div>
          <div className="flex gap-3">
            <label htmlFor="plant">Approver:</label>
            <p className="text-sm">{approver}</p>
          </div>
          <div className="flex gap-3">
            <label htmlFor="plant">Requested at:</label>
            <p className="text-sm">
              {moment(created_at).format("YYYY-MM-DD HH:mm:ss")}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default page;
