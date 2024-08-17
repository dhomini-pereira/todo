"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

interface LoadingContextType {
  isActive: boolean;
  toggle: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isActive, setIsActive] = useState<boolean>(false);

  const toggle = () => setIsActive((prev) => !prev);

  return (
    <LoadingContext.Provider value={{ isActive, toggle }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}
