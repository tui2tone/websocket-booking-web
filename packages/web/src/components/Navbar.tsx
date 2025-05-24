import { useAuth } from "@/hooks/auth.provider";
import { useSocket } from "@/hooks/socketio.provider";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const { isConnected } = useSocket();
  const { user } = useAuth();

  return (
    <div className="w-full shadow-xl ">
      <div className="container mx-auto px-4 w-full max-w-screen-lg h-[80px] flex items-center justify-center">
        {/* Logo */}
        <Link href="/">
          <div className="text-2xl font-bold">
            <span className="text-yellow-500">Hostel</span>
            <span>Booker</span>
          </div>
        </Link>
        {isConnected && (
          <div className="flex items-center justify-center px-4 gap-2 text-sm text-lime-600 font-medium">
            <div className="w-2 h-2 rounded-full bg-lime-600"></div>Connected
          </div>
        )}
        <div className="flex-1"></div>
        <div className="flex items-center justify-center gap-2">
          <div className="text-sm lowercase text-gray-500 font-medium">
            {user?.email}
          </div>
          <img
            src="/images/avatar.jpg"
            className="w-8 h-8 rounded-full border border-gray-200"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
