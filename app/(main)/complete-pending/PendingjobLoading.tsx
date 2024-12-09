"use client";
import { CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

type Props = {};

const PendingjobLoading = (props: Props) => {
  return (
    <CardContent className="flex flex-col 2xl:h-[700px] h-[390px] font-semibold text-xl 2xl:text-4xl gap-3">
      {[...Array(3)].map((_, index) => (
        <Skeleton
          className="w-full text-center h-1/3 flex flex-col justify-center items-center bg-blue-600 bg-opacity-10 rounded-md"
          key={index}
        />
      ))}
    </CardContent>
  );
};

export default PendingjobLoading;
