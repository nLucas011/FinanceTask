import "@/style/globals.css";

import LayoutProvider from "@/components/layout/root";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { Inter } from "next/font/google";

export const metadata: Metadata = {
  title: "Finance Task",
  description: "Tenha o controle da suas finanças ",
};

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: string | JSX.Element;
}) {
  return (
    <html lang="pt-br">
      <body
        className={cn(
          "dark min-h-screen bg-[#0b0e13] text-zinc-50 font-sans antialiased",
          fontSans.variable
        )}
      >
        <LayoutProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </LayoutProvider>
      </body>
    </html>
  );
}
