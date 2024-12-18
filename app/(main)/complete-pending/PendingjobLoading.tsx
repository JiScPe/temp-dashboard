"use client";
import { CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

type Props = {};

const PendingjobLoading = (props: Props) => {
  return (
    <CardContent className="flex flex-col font-semibold text-xl 2xl:text-4xl gap-3">
      <div className="flex gap-2">
        <Skeleton className="w-full text-center h-full flex flex-col justify-center items-center bg-blue-600 bg-opacity-10 rounded-md 2xl:py-10 py-2"></Skeleton>
        <Skeleton className="w-full text-center h-full flex flex-col justify-center items-center bg-blue-600 bg-opacity-10 rounded-md 2xl:py-10 py-2"></Skeleton>
      </div>
      <Skeleton className="w-full text-center h-full flex justify-center items-center bg-blue-600 bg-opacity-10 rounded-md 2xl:py-7 py-2"></Skeleton>
    </CardContent>
  );
};

export default PendingjobLoading;
