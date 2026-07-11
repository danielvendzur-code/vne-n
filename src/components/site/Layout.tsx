import type { ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { SiteAssistantMount } from "@/components/SiteAssistantMount";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--background)" }}>
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
      <SiteAssistantMount />
    </div>
  );
}
