import React from "react";
import { FaEye } from "react-icons/fa";

const PageHeader: React.FC<{
  title: string;
  description?: string;
  currentView: number;
}> = ({ title, description, currentView }) => {
  return (
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
      <div className="container mx-auto max-w-screen-lg py-16 md:py-32 relative z-2">
        <div className="uppercase text-center text-white font-bold">
          {description}
        </div>
        <div className="h-1 w-40 border-b border-white mx-auto opacity-50 my-4"></div>
        <h2
          className="text-center font-bold text-white text-5xl"
          dangerouslySetInnerHTML={{ __html: title }}
        ></h2>

        {currentView > -1 && <div className="mt-6">
          <div className="flex flex-wrap justify-center items-center text-white text-xl gap-2">
            <FaEye />
            <span className="text-xl font-bold">{currentView || 0}</span>
          </div>
        </div> }
      </div>
    </div>
  );
};

export default PageHeader;
