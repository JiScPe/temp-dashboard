"use client";
import React, { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { LoaderCircle } from "lucide-react";

type FormValue = {
  material: string;
  reason: string;
  requestor: string;
};

const ErrorMessage = ({ error_msg }: { error_msg: string | undefined }) => {
  return <label className="text-red-500 text-sm">{error_msg}</label>;
};

const WhiteList = () => {
  const { toast } = useToast();
  const [materialList, setmaterialList] = useState<string[]>([]);
  const [isBtnLoading, setisBtnLoading] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValue>({
    defaultValues: {
      material: "",
      reason: "",
      requestor: "",
    },
  });

  const onsubmit = handleSubmit(async (data) => {
    setisBtnLoading(true);

    const reqBody = {
      requestor: data.requestor,
      material: data.material.replace(/[\r\n]+/g, "").trim(),
      reason: data.reason,
    };
    const createRes = await fetch("/api/create-whitelist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqBody),
    });

    if (!createRes.ok) {
      const { message } = await createRes.json();
      return toast({
        title:
          "Create whitelist in database falied! Please contact administrator.",
        description: message,
        variant: "destructive",
        duration: 1000 * 10,
      });
    }

    if (createRes.ok) {
      setisBtnLoading(false);

      // call gmdc API
      const materialArr = data.material?.replaceAll(" ", "").split(",");
      const res = await fetch(
        "https://gmdc.haier.net/gims/api/tBillLocalSendMain/addMaterialWhitelist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Entrance: "thailand",
            Cookie:
              "INGRESSCOOKIE=f9412ef21c69ed9b0243c6fd4108d63f|3cdfe95961407725ba10481251dd3197",
          },
          body: JSON.stringify(materialArr),
        }
      );
      const whitelist_res = await res.json();

      if (!res.ok) {
        return toast({
          title:
            "Create whitelist failed please check your information and submit again!",
          description: JSON.stringify(whitelist_res),
          variant: "destructive",
          duration: 1000 * 10,
        });
      }
      toast({
        title: "Create whitelist successfully!",
        description: JSON.stringify(whitelist_res),
        variant: "success",
        duration: 1000 * 3,
      });
      reset();
    }
  });

  return (
    <form onSubmit={onsubmit} className="flex flex-col gap-3">
      <div className="flex gap-2 flex-col 2xl:flex-row">
        <label htmlFor="requestor">
          <strong className="text-red-600">*</strong>Your Name:
        </label>
        <div className="flex flex-col w-full lg:w-1/2 2xl:w-1/2">
          <input
            {...register("requestor", { required: "กรุณาใส่ชื่อผู้ร้องขอ" })}
            type="text"
            name="requestor"
            className="border border-slate-400 rounded-sm bg px-1 text-sm"
          />
          {errors.requestor && (
            <ErrorMessage error_msg={errors.requestor.message} />
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <label htmlFor="material">
          <strong className="text-red-600">*</strong>Material
        </label>
        <textarea
          {...register("material", {
            required: "กรุณาใส่ material!",
          })}
          name="material"
          placeholder="material1,material2, ..."
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            const arr = e.target.value.split(",");
            if (e.target.value.length > 12) {
              setmaterialList(arr);
            } else {
              setmaterialList([e.target.value]);
            }
          }}
          rows={7}
          className="border border-slate-400 p-1 rounded-sm bg text-sm"
        />
        {errors.material && (
          <ErrorMessage error_msg={errors.material.message} />
        )}
        {materialList.length > 0 && (
          <p className="text-xs mt-1 text-gray-600">
            Total material: {materialList.length}
          </p>
        )}
      </div>
      <div className="flex flex-col">
        <label htmlFor="reason">
          <strong className="text-red-600">*</strong>Reason:
        </label>
        <textarea
          rows={5}
          {...register("reason", { required: "กรุณาระบุเหตุผล!" })}
          placeholder="ระบุเหตุผล"
          className="border border-slate-400 p-1 rounded-sm text-sm"
        />
        {errors.reason && <ErrorMessage error_msg={errors.reason.message} />}
      </div>
      <div className="flex items-center w-full mx-auto">
        <button
          type="submit"
          className="bg-emerald-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-emerald-700 text-center"
        >
          {isBtnLoading ? <LoaderCircle className="animate-spin" /> : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default WhiteList;
