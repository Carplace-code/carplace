import { esES } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/utils/cn";
import AuthenticationProvider from "providers/AuthenticationProvider";
import QueryClientProvider from "providers/QueryClientProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CarPlace",
  description: "Find your next car easily",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider localization={esES}>
      <html lang="es">
        <body className={cn(inter.className, "flex h-screen w-screen flex-col")}>
          <AuthenticationProvider>
            <QueryClientProvider>
              <Navbar />
              <main className="flex w-full flex-grow flex-col">{children}</main>
              <Footer />
              <Toaster />
            </QueryClientProvider>
          </AuthenticationProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
