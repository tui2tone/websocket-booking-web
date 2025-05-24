"use client";

import { Room } from "@/dto/room";
import { getRooms } from "@/services/room";
import React, { useEffect, useState } from "react";

const RoomLists: React.FC = () => {
  const [rooms, setRooms] = useState([] as Room[]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      const result = await getRooms({
        query: searchQuery,
      });
      setRooms(result as Room[]);
    }
    fetchData();
  }, [searchQuery]);

  return (
    <div className="container mx-auto max-w-screen-lg -mt-8 px-4 relative">
      <div className="bg-white shadow-xl px-12 py-12 rounded-xl  mb-8">
        <h2 className="text-3xl font-semibold mb-6">Rooms</h2>

        <input
          type="text"
          placeholder="Search rooms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
        />

        <div className="grid gap-4">
          {rooms.map((room) => {
            return (
              <div
                key={room.id}
                className="flex items-center justify-center bg-white border shadow rounded p-4"
              >
                <div className="font-bold flex-1">{room.name}</div>

                <div>
                  {room.available_slot} / {room.slot}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoomLists;
