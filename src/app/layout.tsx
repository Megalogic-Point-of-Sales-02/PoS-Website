import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import AuthProvider from "./AuthProvider";
import { CustomerChurnPredictionProvider } from "@/utils/predictionContext";
import { CustomerSegmentationPerformProvider } from "@/utils/performContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Megalogic Point of Sales",
  description: "Megalogic Point of Sales Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <CustomerChurnPredictionProvider>
            <CustomerSegmentationPerformProvider>
              <AuthProvider>{children}</AuthProvider>
            </CustomerSegmentationPerformProvider>
          </CustomerChurnPredictionProvider>
        </Providers>
      </body>
    </html>
  );
}
