import SidebarWithHeader from "@/components/SidebarWithHeader";

export default function MainAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SidebarWithHeader>{children}</SidebarWithHeader>;
}
