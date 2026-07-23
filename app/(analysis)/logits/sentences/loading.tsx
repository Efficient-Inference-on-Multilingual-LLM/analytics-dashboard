import React from "react";
import { Spinner } from "@/components/ui/spinner";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Spinner className="size-8" />
      <p>Loading...</p>
    </div>
  );
};

export default Loading;
