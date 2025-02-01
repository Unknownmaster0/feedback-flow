"use client";

import { createContext, useState } from "react";
import { SessionPayload } from "@/types/definitions";

export const CustomSessionContext = createContext<{
  customSession: SessionPayload | null;
  setCustomSession: (session: SessionPayload | null) => void;
}>({
  customSession: null,
  setCustomSession: () => {},
});

export default function CustomSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [customSession, setCustomSession] =
    useState<SessionPayload | null>(null);
  return (
    <CustomSessionContext.Provider value={{ customSession, setCustomSession }}>
      {children}
    </CustomSessionContext.Provider>
  );
}