import { Toaster } from "@/components/atoms/toaster";
import { Toaster as Sonner } from "@/components/atoms/sonner";
import { TooltipProvider } from "@/components/atoms/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WorkoutSessionProvider } from "@/contexts/WorkoutSessionContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import "../src/index.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

export default function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <WorkoutSessionProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <div className={`${GeistSans.className} ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
              <Component {...pageProps} />
            </div>
          </TooltipProvider>
        </WorkoutSessionProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
