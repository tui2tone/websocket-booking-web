"use client";

import React, { useEffect, useState } from "react";
import { Bed, BedStatus } from "@/dto/bed";
import cx from "classnames";
import { useSocket } from "@/hooks/socketio.provider";
import { useAuth } from "@/hooks/auth.provider";
interface BedItemProps {
  bed: Bed;
}

const BedItem: React.FC<BedItemProps> = ({ bed }) => {
  const [status, setStatus] = useState<BedStatus>(1);
  const { socket } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (socket && user.uuid) {
      socket.on("updateCurrentBedStatus", (updated) => {
        if (updated.roomId === bed.room_id && updated.bedId === bed.id) {
          if (
            updated.status == BedStatus.Locked &&
            updated.lockedUserId == user.id
          ) {
            setStatus(BedStatus.Selected);
          } else {
            setStatus(updated.status);
          }
        }
      });

      return () => {
        socket.off("updateCurrentBedStatus");
      };
    }
  }, [bed, socket, user?.uuid]);

  useEffect(() => {
    if (bed.status) {
      setStatus(bed.status);
    }
  }, [bed.status]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    socket?.emit("lockBedQueue", {
      roomId: bed?.room_id,
      bedId: bed?.id,
      token: user?.uuid,
    });
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    socket?.emit("finishBedQueue", {
      roomId: bed?.room_id,
      bedId: bed?.id,
      token: user?.uuid,
    });
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    socket?.emit("cancelBedQueue", {
      roomId: bed?.room_id,
      bedId: bed?.id,
      token: user?.uuid,
    });
  };

  const getStatusText = (currentStartus: number) => {
    switch (currentStartus) {
      case BedStatus.Available:
        return "Available";
      case BedStatus.Booked:
        return "Booked";
      case BedStatus.Locked:
        return "Locked";
      case BedStatus.Selected:
        return "Selected";
    }
  };

  return (
    <div
      className={cx(
        "border-2 bg-white rounded-lg overflow-hidden hover:cursor-pointer",
        {
          "border-green-500": status === BedStatus.Available,
          "border-yellow-500": status === BedStatus.Locked,
          "border-blue-500": status === BedStatus.Selected,
          "border-gray-500": status === BedStatus.Booked,
        }
      )}
      onClick={handleClick}
    >
      <div className="relative">
        <img src="/images/hostel-1.jpg" />
        <div
          className={cx(
            "absolute transition top-0 z-0 right-0 w-full h-full bg-black bg-opacity-50 hover:bg-opacity-85",
            {
              "bg-black ": status !== BedStatus.Selected,
              "bg-blue-800": status === BedStatus.Selected,
            }
          )}
        ></div>
        <div className="absolute bottom-0 z-1 left-0 p-4">
          <div className="uppercase text-white text-xl font-semibold">
            Bed #{bed.bed_no}
          </div>
        </div>
        <div
          className={cx(
            "absolute top-0 left-0 text-center uppercase font-bold p-2 w-full text-white opacity-85",
            {
              "bg-green-500 ": status === BedStatus.Available,
              "bg-yellow-500": status === BedStatus.Locked,
              "bg-blue-500": status === BedStatus.Selected,
              "bg-gray-500": status === BedStatus.Booked,
            }
          )}
        >
          {getStatusText(status)}
        </div>

        {status === BedStatus.Selected && (
          <div className="absolute px-4 top-1/2 left-0 w-full flex items-center justify-center transform -translate-y-1/2 gap-4">
            <button
              onClick={handleSubmit}
              className="bg-green-500 border-4 border-white hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
            >
              Confirm
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 hover:bg-gray-700 border-4 border-white text-white font-bold py-2 px-4 rounded-lg"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BedItem;
