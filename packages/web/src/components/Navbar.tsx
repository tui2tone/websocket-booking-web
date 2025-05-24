import { useSocket } from "@/hooks/socketio.provider";
import React, { useEffect, useState } from "react";

const Navbar = () => {
  const { isConnected } = useSocket();

  return (
    <div className="w-full shadow-xl ">
      <div className="container mx-auto px-4 w-full max-w-screen-lg h-[80px] flex items-center justify-center">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <span className="text-yellow-500">Hostel</span>
          <span>Booker</span>
        </div>
        {isConnected && (
          <div className="flex items-center justify-center px-4 gap-2 text-sm text-lime-600 font-medium">
            <div className="w-2 h-2 rounded-full bg-lime-600"></div>Connected
          </div>
        )}
        <div className="flex-1"></div>
        {/* Profile Menu */}
      </div>
    </div>
  );
};

export default Navbar;
