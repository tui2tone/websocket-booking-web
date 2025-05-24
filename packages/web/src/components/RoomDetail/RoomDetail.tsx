import React, { useEffect, useState } from "react";
import PageHeader from "../PageHeader";
import { Room } from "@/dto/room";
import { getRoomById } from "@/services/room";
import BedLists from "./BedLists";

interface RoomDetailProps {
  roomId: number;
}

const RoomDetail: React.FC<RoomDetailProps> = ({ roomId }) => {
  const [room, setRoom] = useState(null as Room | null);

  useEffect(() => {
    async function fetchData() {
      const result = await getRoomById(roomId);
      setRoom(result as Room);
    }
    fetchData();
  }, []);

  return (
    <>
      <PageHeader title={room?.name || "&nbsp;"} description="Room" />
      { room && <BedLists room={room} /> }
    </>
  );
};

export default RoomDetail;
