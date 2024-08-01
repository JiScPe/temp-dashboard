"use client";
import moment from "moment";
import React, { useEffect, useState } from "react";

const CurrentTime = () => {
  const [currentDate, setcurrentDate] = useState<string>(
    moment().format("YYYY-MM-DD HH:mm:ss")
  );
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
    const intervalId = setInterval(() => {
      setcurrentDate(moment().format("YYYY-MM-DD HH:mm:ss"));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return <p>{isClient ? currentDate : null}</p>;
};

export default CurrentTime;
