import React, { useEffect, useState } from "react";
import PageHeader from "../PageHeader";
import { Room } from "@/dto/room";
import { getRoomById } from "@/services/room";
import BedLists from "./BedLists";
import { useSocket } from "@/hooks/socketio.provider";
import { useAuth } from "@/hooks/auth.provider";
import QueueWaiting from "./QueueWaiting";

interface RoomDetailProps {
  roomId: number;
}

interface QueueDto {
  status: QueueStatus;
  waitQueue: number;
  totalQueue: number;
}

export enum QueueStatus {
  Checking = 1,
  Waiting = 2,
  OnGoing = 3,
}

const RoomDetail: React.FC<RoomDetailProps> = ({ roomId }) => {
  const [room, setRoom] = useState(null as Room | null);
  const [currentView, setCurrentView] = useState(0);
  const [queue, setQueue] = useState({
    status: QueueStatus.Checking,
    waitQueue: 0,
    totalQueue: 0,
  } as QueueDto);
  const { socket } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (socket && user.uuid) {
      socket.emit(
        "subscribeToBookingQueue",
        {
          token: user.uuid,
          roomId,
        },
        (response: QueueDto) => {
          setQueue({
            status: response?.status as QueueStatus,
            waitQueue: response?.waitQueue || 0,
            totalQueue: response?.totalQueue || 0,
          });
        }
      );

      socket.on("updateCurrentBookingView", (updated) => {
        if (updated.roomId === roomId) {
          setCurrentView(updated.currentView);
        }
      });

      socket.on("onQueueChanged", (updated) => {
        if (updated.roomId === roomId) {
          // Room Queue Changed
          recheckMyQueue()
        }
      });

      return () => {
        socket.emit("unsubscribeToBookingQueue", {
          token: user.uuid,
          roomId,
        });
        socket.off("onQueueChanged");
        socket.off("updateCurrentBookingView");
      };
    }
  }, [roomId, socket, user?.uuid]);

  const recheckMyQueue = () => {
    if (socket) {
      socket.emit(
        "recheckMyBookingQueue",
        {
          token: user.uuid,
          roomId,
        },
        (response: QueueDto) => {
          setQueue({
            status: response?.status as QueueStatus,
            waitQueue: response?.waitQueue || 0,
            totalQueue: response?.totalQueue || 0,
          });
        }
      );
    }
  };

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
      {room && queue.status === QueueStatus.OnGoing && <BedLists room={room} />}
      {room && queue.status === QueueStatus.Waiting && (
        <QueueWaiting waitQueue={queue.waitQueue} />
      )}
    </>
  );
};

export default RoomDetail;
