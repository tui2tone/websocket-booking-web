import React from "react";

const Navbar: React.FC = () => {
  return (
    <div className="w-full shadow-xl ">
      <div className="container mx-auto px-4 w-full max-w-screen-lg h-[80px] flex items-center justify-center">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <span className="text-yellow-500">Hostel</span>
          <span>Booker</span>
        </div>
        <div className="flex-1"></div>
        {/* Profile Menu */}

        
      </div>
    </div>
  );
};

export default Navbar;
