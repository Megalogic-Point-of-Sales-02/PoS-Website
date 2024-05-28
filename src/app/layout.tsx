import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import SidebarWithHeader from "@/components/SidebarWithHeader";
import AuthProvider from "./AuthProvider";
import SidebarWrapper from "@/components/SidebarWrapper";

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
          <AuthProvider>
            <SidebarWrapper>{children}</SidebarWrapper>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
