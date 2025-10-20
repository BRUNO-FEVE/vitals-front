"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import imgPath from "../../../public/vitals.png";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/"); // Redirect to home after 5 seconds
    }, 5000);

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [router]);

  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center">
      <Image src={imgPath} alt="Vitals image" priority />
    </div>
  );
}
