import SidebarWithHeader from "@/components/SidebarWithHeader";
import { CustomerChurnPredictionProvider } from "@/utils/predictionContext";
import { CustomerSegmentationPerformProvider } from "@/utils/performContext";

export default function MainAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CustomerChurnPredictionProvider><CustomerSegmentationPerformProvider>
      <SidebarWithHeader>{children}</SidebarWithHeader>
    </CustomerSegmentationPerformProvider></CustomerChurnPredictionProvider>
  );
}
