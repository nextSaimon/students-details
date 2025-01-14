import React from "react";
import { Loader2 } from "lucide-react";
const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="mt-4 text-xl text-gray-700">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
