import React from "react";

interface QueueProps {
  waitQueue?: number;
  totalQueue?: number;
}

const QueueWaiting: React.FC<QueueProps> = ({ waitQueue }) => {
  const nextQueue = (waitQueue || 1) - 1;
  return (
    <div className="container mx-auto max-w-screen-lg -mt-8 px-4 relative">
      <div className="bg-white shadow-xl px-12 py-40 text-center rounded-xl font-semibold text-neutral-400 text-lg mb-8">
        Your a waiting in queue. Please wait.
        <br />
        {nextQueue == 0
          ? "Your are next in line."
          : `They are ${nextQueue} people ahead of you.`}
      </div>
    </div>
  );
};

export default QueueWaiting;
