"use client";

import { Room, RoomStatus } from "@/dto/room";
import React, { useEffect, useState } from "react";
import cx from "classnames";
import Link from "next/link";
import { useSocket } from "@/hooks/socketio.provider";
import { useAuth } from "@/hooks/auth.provider";

interface RoomItemProps {
  room: Room;
}

const RoomItem: React.FC<RoomItemProps> = ({ room }) => {
  const [currentRoom, setCurrentRoom] = useState<Room>({} as Room);
  const { socket } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (socket && user.uuid) {
      socket.on("updateCurrentRoomStatus", (updated) => {
        if(updated.id) {
          setCurrentRoom(updated)
        }
      });

      return () => {
        socket.off("updateCurrentRoomStatus");
      };
    }
  }, [room, socket, user?.uuid]);

  useEffect(() => {
    function setData() {
      setCurrentRoom(room)
    }
    setData();
  }, [room])

  return (
    <Link href={`/rooms/${room.id}`} passHref>
      <div className="border bg-white rounded-lg overflow-hidden hover:cursor-pointer">
        <div className="relative">
          <img src="/images/hostel-1.jpg" />
          <div className="absolute transition top-0 z-0 right-0 w-full h-full bg-black bg-opacity-60 hover:bg-opacity-85"></div>
          <div className="absolute bottom-0 z-1 left-0 p-4 ">
            <div className="uppercase text-white font-semibold opacity-70">
              Room
            </div>
            <div className="font-bold text-4xl text-white">{currentRoom.name}</div>
          </div>

          <div>

          </div>
        </div>

        <div className="p-1">
          <div
            className={cx(
              "text-center px-4 py-2 text-lg font-semibold rounded border",
              {
                [`text-green-700 bg-green-50 border-green-100`]:
                  currentRoom.status == RoomStatus.Available,
                [`text-yellow-700 bg-yellow-50 border-yellow-100`]:
                  currentRoom.status == RoomStatus.FullyBooked,
              }
            )}
          >
            {currentRoom.status == RoomStatus.Available && (
              <span>
                Available {currentRoom.available_slot}/{currentRoom.slot} Beds
              </span>
            )}
            {currentRoom.status == RoomStatus.FullyBooked && (
              <span>Sorry, Room Fully Booked</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RoomItem;
