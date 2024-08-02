"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Select, message, Progress, Spin } from "antd";
import dayjs from "dayjs";
import "./Dashboard.css";
import Image from "next/image";

// Import images
// import NotHavePO from "../assets/images/dashboard/Not-Have-PO.png";
// import PONotEnough from "../assets/images/dashboard/PO-Not-Enough.png";
// import Delivering from "../assets/images/dashboard/Delivering.png";
// import Pickup from "../assets/images/dashboard/Pickup.png";
// import Handover from "../assets/images/dashboard/Handover.png";
// import Supplier from "../assets/images/dashboard/Supplier.png";
// import Factory from "../assets/images/dashboard/Factory.png";

// const { Option } = Select;

const stateDescriptions: Record<string, string> = {
  CS3: "Don't have PO",
  CS2: "PO Not Enough",
  CS1: "Delivering",
  OP: "Pickup",
  HC: "Handover Completed",
};

const stateOrder: string[] = ["CS3", "CS2", "CS1", "OP", "HC"];

const stateImages: Record<string, string> = {
  CS3: "/assets/images/dashboard/Not-Have-PO.png",
  CS2: "/assets/images/dashboard/PO-Not-Enough.png",
  CS1: "/assets/images/dashboard/Delivering.png",
  OP: "/assets/images/dashboard/Pickup.png",
  HC: "/assets/images/dashboard/Handover.png",
};

type DashboardProps = {
  plant: string;
};

const Dashboard: React.FC<DashboardProps> = ({ plant }) => {
  // const [plant, setPlant] = useState<string>("9774");
  const [stateCounts, setStateCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async (selectedPlant: string) => {
    if (!selectedPlant) {
      message.error("Please select a plant");
      return;
    }

    const currentDate = dayjs().format("YYYY-MM-DD");
    const apiUrl = `http://10.35.10.47:2003/api/Warehouse9770/GetT1ReportMain?plant=${selectedPlant}&start_date=${currentDate}&end_date=${currentDate}`;

    setLoading(true);
    try {
      const response = await axios.get(apiUrl);
      const data = response.data;

      const counts: Record<string, number> = data.reduce(
        (acc: Record<string, number>, item: { state: string }) => {
          acc[item.state] = (acc[item.state] || 0) + 1;
          return acc;
        },
        {}
      );

      setStateCounts(counts);
      setLoading(false);
    } catch (err) {
      message.error("Error fetching data");
      setLoading(false);
    }
  };

  // const handlePlantChange = (value: string) => {
  //   setPlant(value);
  //   fetchData(value);
  // };

  const getTotalCount = (): number => {
    return Object.values(stateCounts).reduce((acc, count) => acc + count, 0);
  };

  const totalStateCount = getTotalCount();

  useEffect(() => {
    if (plant) {
      fetchData(plant);
      const interval = setInterval(() => {
        fetchData(plant);
      }, 300000); // 300000 ms = 5 minutes

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [plant]);

  const stateColors: Record<string, string> = {
    CS3: "#f5222d",
    CS2: "#fa8c16",
    CS1: "#722ed1",
    OP: "#0464F0",
    HC: "#52c41a",
  };

  return (
    <div style={{ padding: 20, position: "relative" }}>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <Spin tip="Loading..." size="large" />
        </div>
      )}
      {/* <div style={{ marginBottom: 40, marginTop: 10, marginLeft: 10 }}>
        <b style={{ color: "white" }}>Plant:</b>
        <Select
          value={plant}
          onChange={handlePlantChange}
          style={{ width: 100, marginLeft: 8 }}
          placeholder="Select Plant"
          disabled={loading}
        >
          <Option value="9771">RF</Option>
          <Option value="9773">WAC</Option>
          <Option value="9774">SAC</Option>
        </Select>
      </div> */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          alignItems: "center",
        }}
        // className="centered"
      >
        <div className="image-container">
          <Image
            src={"/assets/images/dashboard/Supplier.png"}
            width={90}
            height={90}
            className="white-image2"
            alt="Supplier"
          />
          <div className="image-text">Supplier</div>
        </div>
        <div style={{ width: "80vw", position: "relative", marginTop: "50px" }}>
          <Progress
            percent={100}
            status="active"
            format={() => null}
            strokeColor={{
              "0%": stateCounts["CS3"] > 0 ? stateColors["CS3"] : "transparent",
              [`${((stateCounts["CS3"] || 0) / totalStateCount) * 100 - 0.1}%`]:
                stateCounts["CS3"] > 0 ? stateColors["CS3"] : "transparent",
              [`${((stateCounts["CS3"] || 0) / totalStateCount) * 100}%`]:
                stateCounts["CS2"] > 0 ? stateColors["CS2"] : "transparent",
              [`${
                (((stateCounts["CS3"] || 0) + (stateCounts["CS2"] || 0)) /
                  totalStateCount) *
                  100 -
                0.1
              }%`]: stateCounts["CS2"] > 0 ? stateColors["CS2"] : "transparent",
              [`${
                (((stateCounts["CS3"] || 0) + (stateCounts["CS2"] || 0)) /
                  totalStateCount) *
                100
              }%`]: stateCounts["CS1"] > 0 ? stateColors["CS1"] : "transparent",
              [`${
                (((stateCounts["CS3"] || 0) +
                  (stateCounts["CS2"] || 0) +
                  (stateCounts["CS1"] || 0)) /
                  totalStateCount) *
                  100 -
                0.1
              }%`]: stateCounts["CS1"] > 0 ? stateColors["CS1"] : "transparent",
              [`${
                (((stateCounts["CS3"] || 0) +
                  (stateCounts["CS2"] || 0) +
                  (stateCounts["CS1"] || 0)) /
                  totalStateCount) *
                100
              }%`]: stateCounts["OP"] > 0 ? stateColors["OP"] : "transparent",
              [`${
                (((stateCounts["CS3"] || 0) +
                  (stateCounts["CS2"] || 0) +
                  (stateCounts["CS1"] || 0) +
                  (stateCounts["OP"] || 0)) /
                  totalStateCount) *
                  100 -
                0.1
              }%`]: stateCounts["OP"] > 0 ? stateColors["OP"] : "transparent",
              [`${
                (((stateCounts["CS3"] || 0) +
                  (stateCounts["CS2"] || 0) +
                  (stateCounts["CS1"] || 0) +
                  (stateCounts["OP"] || 0)) /
                  totalStateCount) *
                100
              }%`]: stateCounts["HC"] > 0 ? stateColors["HC"] : "transparent",
              "100%": stateCounts["HC"] > 0 ? stateColors["HC"] : "transparent",
            }}
            trailColor="#B7B5B5"
            size={['100%', 25]}
          />
          {stateOrder.map((state, index) => {
            const count = stateCounts[state] || 0;
            const percentage =
              totalStateCount > 0
                ? ((count / totalStateCount) * 100).toFixed(2)
                : 0;

            let cumulativePercentage = 0;
            for (let i = 0; i < index; i++) {
              cumulativePercentage +=
                ((stateCounts[stateOrder[i]] || 0) / totalStateCount) * 100;
            }
            cumulativePercentage += (count / totalStateCount) * 50;
            const positionTop = index % 2 === 0;

            if (count === 0) return null;

            return (
              <div
                key={state}
                style={{
                  position: "absolute",
                  top: positionTop ? "-180%" : "100%",
                  left: `${cumulativePercentage}%`,
                  transform: "translateX(-50%)",
                  textAlign: "center",
                  color: "white",
                  //   zIndex: 10, // Ensure text is above progress bar
                }}
              >
                <Image
                  src={stateImages[state]}
                  width={90}
                  height={90}
                  alt={state}
                  style={{
                    marginBottom: "8px",
                    filter: "brightness(0) invert(1)",
                    position: "absolute",
                    top: positionTop ? "-90%" : "120%",
                    transform: "translateX(15%)",
                    // zIndex: 10,
                  }}
                />
                <div style={{ marginTop: "10px", fontSize: "19px" }}>
                  <h1>{percentage}%</h1>
                </div>
              </div>
            );
          })}
        </div>
        <div className="image-container">
          <Image
            src={"/assets/images/dashboard/Factory.png"}
            width={90}
            height={90}
            className="white-image2"
            alt="Factory"
          />
          <div className="image-text">Factory</div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: 130,
          justifyContent: "center",
          alignItems: "flex-start",
          gap: "50px",
        }}
      >
        {stateOrder.map((state) => {
          const count = stateCounts[state] || 0;
          const color = stateColors[state];
          return (
            <div
              key={state}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <div
                style={{
                  width: "15px",
                  height: "15px",
                  backgroundColor: color,
                }}
              ></div>
              <span style={{ color: "white" }}>
                <h3>
                  {stateDescriptions[state]} : <b>( {count} )</b>
                </h3>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
