import { WhitelistDataType } from "@/app/types/whitelist-type";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { View } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import React from "react";

const API_URL: string | undefined = process.env.API_URL;

const page = async () => {
  console.log("fetching whitelist all...");
  console.log(`API: ${API_URL}`);

  try {
    let data = await fetch(`${API_URL}/api/whitelist`, {
      cache: "no-cache",
    });

    let { rows } = await data.json();
    console.log(rows);
    let whitelist_data: WhitelistDataType[] = rows;

    return (
      <main className="bg-[#065aa8] text-black h-screen w-full flex">
        <div className="w-4/5 xl:w-4/5 2xl:w-3/4 mx-auto p-7 bg-white backdrop-blur-md rounded-md gap-2 text-[#2f353b] shadow-xl my-10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Plant</TableHead>
                <TableHead>Requestor</TableHead>
                <TableHead>material</TableHead>
                <TableHead>reason</TableHead>
                <TableHead>status</TableHead>
                <TableHead>approver</TableHead>
                <TableHead>created_at</TableHead>
                <TableHead>Operation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {whitelist_data.map(
                ({
                  id,
                  plant,
                  requestor,
                  material,
                  reason,
                  status,
                  approver,
                  created_at,
                }) => (
                  <TableRow key={id}>
                    <TableCell>{id}</TableCell>
                    <TableCell>{plant}</TableCell>
                    <TableCell>{requestor}</TableCell>
                    <TableCell>{material}</TableCell>
                    <TableCell>{reason}</TableCell>
                    <TableCell>{status}</TableCell>
                    <TableCell>{approver}</TableCell>
                    <TableCell>
                      {moment(created_at).format("YYYY-MM-DD HH:mm:ss")}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/whitelist/${id}`}
                        title="view"
                        className="hover:text-blue-600"
                      >
                        <View
                          className="hover:bg-blue-200 rounded-full p-1"
                          size={28}
                        />
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    );
  } catch (error) {
    console.error(`Error: ${error}`);
    return (
      <main className="bg-[#065aa8] h-screen w-full flex items-center justify-center text-white">
        <p>Error fetching data!</p>
      </main>
    );
  }
};

export default page;
