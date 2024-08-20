import React from "react";
import AttendanceComponent from "../../components/Attendance";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Attendance Report",
  description: "Attendance Report",
};

const Attendance = () => {
  return <AttendanceComponent />;
};

export default Attendance;
