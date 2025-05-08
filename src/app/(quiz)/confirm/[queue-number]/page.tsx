"use client";

import { Button } from "@/components/button";
import { Check, X } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

interface PageProps {
  params: { "queue-number": string };
}

export default function Page({}: PageProps) {
  const router = useRouter();

  const obj = {
    name: "Bruno Augusto Lopes Fevereiro",
    "date-of-birth": "10/07/2002",
  };

  return (
    <div className="bg-brand-primary w-screen h-screen flex justify-center items-center">
      <div className="bg-white w-[95%] h-[90%] relative flex flex-col justify-end">
        <h1 className="absolute text-8xl font-extralight top-4 left-4 leading-[105%]">
          CONFIRME <br /> OS <br /> DADOS
        </h1>
        <div className="w-full h-1/2 grid grid-cols-2 grid-rows-2 gap-0">
          <div className="w-full h-full"></div>
          <div className="w-full h-full bg-black text-white font-mono p-3">
            <p className="font-bold text-xl m-0">
              {obj.name} <br />
              <span className="font-normal text-base">Data de Nascimento </span>
              {obj["date-of-birth"]}
            </p>
          </div>
          <Button
            icon={<X strokeWidth={1} />}
            direction="left"
            className="pr-0 h-full"
            buttonBgColor="bg-black"
            contentBgColor="bg-white"
            onClick={() => {
              router.push(`/`);
            }}
          />
          <Button
            icon={<Check strokeWidth={1} />}
            direction="right"
            className="pl-0.1 h-full"
            buttonBgColor="bg-black"
            contentBgColor="bg-white"
          />
        </div>
      </div>
    </div>
  );
}
