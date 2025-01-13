import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="animate-spin h-16 w-16 border-8 border-t-8 border-blue-500 border-gray-300 rounded-full"></div>
      <h2 className="mt-4 text-lg text-gray-700">Loading...</h2>
    </div>
  );
};

export default Loading;
