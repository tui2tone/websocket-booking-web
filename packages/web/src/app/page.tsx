import RoomLists from "@/components/Dashboard/RoomLists";
import Navbar from "@/components/Navbar";
import PageLayout from "@/layouts/PageLayout";
import Image from "next/image";

export default function Home() {
  return (
    <PageLayout>

      <div className="relative">
        <div
          className="absolute z-0 top-0 left-0 right-0 bottom-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/bg-heading-1.jpg)" }}
        ></div>
        <div
          className="absolute z-1 top-0 left-0 right-0 bottom-0 opacity-80"
          style={{
            background: "linear-gradient(135deg, #FDBB2D 0%, #22C1C3 100%)",
          }}
        ></div>
        <div className="container mx-auto max-w-screen-lg py-20 md:py-40 relative z-2">
          <h2 className="text-center font-bold text-white text-5xl">
            Secure your stay faster with us
          </h2>
        </div>
      </div>
      <RoomLists />
    </PageLayout>
  );
}
