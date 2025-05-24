"use client";

import { Bed } from "@/dto/bed";
import { getBeds } from "@/services/bed";
import React, { useEffect, useState } from "react";
import BedItem from "./BedItem";
import { Room } from "@/dto/room";

const BedLists = ({
  room
}: {
  room: Room
}) => {
  const [beds, setBeds] = useState([] as Bed[]);

  useEffect(() => {
    async function fetchData() {
      const result = await getBeds({
        roomId: room?.id,
      });
      setBeds(result as Bed[]);
    }
    fetchData();
  }, []);

  return (
    <div className="container mx-auto max-w-screen-lg -mt-8 px-4 relative">
      <div className="bg-white shadow-xl px-12 py-12 rounded-xl">
        <h2 className="text-3xl font-semibold mb-6">Beds</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {beds.map((bed) => {
            return <BedItem bed={bed} key={bed.id} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default BedLists;
