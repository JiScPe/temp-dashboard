import React from "react";
import RedirectNavbar from "../../components/RedirectNavbar";
import RepairComponent from "./RepairComponent";

type Props = {
  searchParams: {
    plant: string;
  };
};

const RepairPage = async ({ searchParams }: Props) => {
  const { plant } = searchParams;

  return (
    <section>
      {/* Navbar */}
      <RedirectNavbar plant={plant} url="/repair" />
      {plant && <RepairComponent />}
    </section>
  );
};

export default RepairPage;
