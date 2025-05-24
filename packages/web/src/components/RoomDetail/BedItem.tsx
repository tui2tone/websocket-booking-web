"use client";

import { Bed, BedStatus } from "@/dto/bed";
import React from "react";
import cx from "classnames";
import Link from "next/link";

interface BedItemProps {
  bed: Bed;
}

const BedItem: React.FC<BedItemProps> = ({ bed }) => {
  return (
    <>
      <div className="border bg-white rounded-lg overflow-hidden hover:cursor-pointer">
        <div className="relative">
          <img src="/images/hostel-1.jpg" />
          <div className="absolute transition top-0 z-0 right-0 w-full h-full bg-black bg-opacity-60 hover:bg-opacity-85"></div>
          <div className="absolute bottom-0 z-1 left-0 p-4 ">
            <div className="uppercase text-white text-xl font-semibold">
              Bed #{bed.bed_no}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BedItem;
