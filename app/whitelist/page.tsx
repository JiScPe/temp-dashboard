import React from "react";
import WhiteList from "./WhiteList";

export const metadata = {
  title: "Whitelist Request",
  description: "GMDC Material Whitelist Request",
};

const MaterialWhitelistPage = async () => {
  return (
    <main className="bg-[#065aa8] text-black h-screen w-full pt-10 lg:pt-0 flex items-start lg:items-center 2xl:items-center">
      <div className="w-full xl:w-3/5 2xl:w-2/5 mx-2 lg:mx-auto 2xl:mx-auto p-7 bg-white backdrop-blur-md rounded-md gap-2 text-[#2f353b] shadow-xl">
        <h1 className="text-center font-bold text-md 2xl:text-2xl mb-5">
          Material Whitelist Request Form
        </h1>
        <WhiteList />
      </div>
    </main>
  );
};

export default MaterialWhitelistPage;
