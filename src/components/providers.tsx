"use client";

import { EventProvider } from "@/lib/store";
import { PwaRegister } from "@/components/pwa";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EventProvider>
      <PwaRegister />
      {children}
    </EventProvider>
  );
}
