import type { Metadata } from "next";
import ThemeProvider from "@/modules/providers/ThemeProvider";
import "./globals.css";
import QueryProvider from "@/modules/hooks/QueryProvider";

export const metadata: Metadata = {
  title: "AI SDR",
  description: "Enterprise AI SDR",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
         <QueryProvider>
          {children}
       </QueryProvider>
      </body>
    </html>
  );
}