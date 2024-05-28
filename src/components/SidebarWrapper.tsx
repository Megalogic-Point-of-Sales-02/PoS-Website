"use client";

import React from "react";
import { usePathname } from "next/navigation";
import SidebarWithHeader from "@/components/SidebarWithHeader";

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldRenderSidebar = !["/login", "/register"].includes(pathname);

  return <>{shouldRenderSidebar ? <SidebarWithHeader>{children}</SidebarWithHeader> : children}</>;
}
