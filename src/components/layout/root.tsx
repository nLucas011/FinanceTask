"use client";

import { Sidebar } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { useStore } from "@/hooks/use-store";
import { cn } from "@/lib/utils";
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();

export default function Layout({ children }: { children: React.ReactNode }) {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Sidebar />
        <main
          className={cn(
            "dark min-h-[calc(100vh_-_56px)] bg-black transition-[margin-left] antialiased ease-in-out duration-300",
            sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72"
          )}
        >
          {children}
          <Toaster />
        </main>
      </QueryClientProvider>
    </>
  );
}
