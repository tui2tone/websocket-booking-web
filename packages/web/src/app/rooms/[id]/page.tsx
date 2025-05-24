"use client";

import { useRouter } from "next/navigation";
import { getRoomById } from "@/services/room";
import { useEffect, useState } from "react";
import { Room } from "@/dto/room";
import { useParams } from "next/navigation";
import PageLayout from "@/layouts/PageLayout";
import RoomDetail from "@/components/RoomDetail/RoomDetail";

export default function DetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  return (
    <PageLayout>
      <RoomDetail roomId={parseInt(id as string)} />
    </PageLayout>
  );
};