import SidebarWithHeader from "@/components/SidebarWithHeader";
import { CustomerChurnPredictionProvider } from "@/utils/predictionContext";

export default function MainAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CustomerChurnPredictionProvider>
      <SidebarWithHeader>{children}</SidebarWithHeader>
    </CustomerChurnPredictionProvider>
  );
}
