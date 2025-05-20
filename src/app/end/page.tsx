import React from "react";
import Image from "next/image";
import imgPath from "../../../public/vitals.png";

export default function Page() {
  return (
    <div className="w-screen h-screen bg-black flex justify-center items-center">
      <Image src={imgPath} alt={""} />
    </div>
  );
}
