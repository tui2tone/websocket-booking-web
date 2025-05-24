'use client';

import RoomLists from "@/components/Dashboard/RoomLists";
import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import PageLayout from "@/layouts/PageLayout";
import Image from "next/image";

export default function Dashboard() {
  return (
    <PageLayout>
      <PageHeader title="Secure your stay faster with us" description="Hostel Booking System" currentView={-1} />
      <RoomLists />
    </PageLayout>
  );
}
