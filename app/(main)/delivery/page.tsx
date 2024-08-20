import React from "react";
import Delivery from "../../components/Delivery";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delivery Report",
};

const DeliveryPage = () => {
  return <Delivery />;
};

export default DeliveryPage;
