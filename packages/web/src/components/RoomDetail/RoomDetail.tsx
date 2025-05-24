import React, { useEffect, useState } from "react";
import PageHeader from "../PageHeader";
import { Room } from "@/dto/room";
import { getRoomById } from "@/services/room";
import BedLists from "./BedLists";
import { useSocket } from "@/hooks/socketio.provider";
import { useAuth } from "@/hooks/auth.provider";

interface RoomDetailProps {
  roomId: number;
}

const RoomDetail: React.FC<RoomDetailProps> = ({ roomId }) => {
  const [room, setRoom] = useState(null as Room | null);
  const [currentView, setCurrentView] = useState(0);
  const { socket } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (socket && user.uuid) {
      socket.emit("subscribeToBookingQueue", {
        token: user.uuid,
        roomId,
      });

      socket.on("updateCurrentBookingView", (updated) => {
        if (updated.roomId === roomId) {
          setCurrentView(updated.currentView);
        }
      });

      return () => {
        socket.emit("unsubscribeToBookingQueue", {
          token: user.uuid,
          roomId,
        });
        socket.off("updateCurrentBookingView");
      };
    }
  }, [roomId, socket, user?.uuid]);

  useEffect(() => {
    async function fetchData() {
      const result = await getRoomById(roomId);
      setRoom(result as Room);
    }
    fetchData();
  }, [roomId]);

  return (
    <>
      <PageHeader
        title={room?.name || "&nbsp;"}
        description="Room"
        currentView={currentView}
      />
      {room && <BedLists room={room} />}
    </>
  );
};

export default RoomDetail;
