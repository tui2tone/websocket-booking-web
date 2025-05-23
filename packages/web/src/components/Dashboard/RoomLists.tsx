"use client";

import { Room } from "@/dto/room";
import { getRooms } from "@/services/room";
import React, { useEffect, useState } from "react";
import RoomItem from "./RoomItem";

const RoomLists: React.FC = () => {
  const [rooms, setRooms] = useState([] as Room[]);

  useEffect(() => {
    async function fetchData() {
      const result = await getRooms();
      setRooms(result as Room[]);
    }
    fetchData();
  }, []);

  return (
    <div className="container mx-auto max-w-screen-lg -mt-8 px-4 relative">
      <div className="bg-white shadow-xl px-12 py-12 rounded-xl">
        <h2 className="text-3xl font-semibold mb-6">Rooms</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rooms.map((room) => {
            return <RoomItem room={room} key={room.id} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default RoomLists;
