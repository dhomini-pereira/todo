import { useLoading } from "@/contexts/LoadingContext";
import React from "react";

export default function Loading() {
  const { isActive } = useLoading();
  return (
    <>
      {isActive ? (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <span className="loading loading-ring loading-lg"></span>
        </div>
      ) : null}
    </>
  );
}
