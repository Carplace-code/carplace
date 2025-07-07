"use client";

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Car, Heart, LineChart, Menu, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// simple helper to join classes
const cn = (...args: (string | undefined | false)[]) => args.filter(Boolean).join(" ");

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Inicio", icon: null },
    { href: "/browse", label: "Buscar", icon: null },
    { href: "/trends", label: "Tendencias", icon: <LineChart className="h-4 w-4" /> },
  ];

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <nav className="w-full border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo + Search */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <Car className="h-6 w-6 text-blue-600" />
            <span>CarPlace</span>
          </Link>

          <div className="relative hidden items-center md:flex">
            <Input type="text" placeholder="Search cars, brands, or models..." className="w-80 pr-10" />
            <Search className="absolute top-2.5 right-3 h-4 w-4 text-gray-500" />
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navItems.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1",
                isActive(href) ? "border-b-2 border-blue-600 pb-1 text-blue-600" : "text-gray-700 hover:text-blue-500",
              )}
            >
              {icon}
              {label}
            </Link>
          ))}

          <SignedOut>
            <SignInButton mode="modal">Iniciar sesión</SignInButton>
            <SignUpButton mode="modal">Crear cuenta</SignUpButton>
          </SignedOut>

          <SignedIn>
            <Link
              href="/wishlists"
              className={cn(
                "flex items-center gap-1",
                isActive("/wishlists")
                  ? "border-b-2 border-blue-600 pb-1 text-blue-600"
                  : "text-gray-700 hover:text-blue-500",
              )}
            >
              <Heart className="h-4 w-4" />
              Listas de deseos
            </Link>
            <UserButton />
          </SignedIn>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Menu className="h-6 w-6 cursor-pointer" onClick={() => setMobileOpen(!mobileOpen)} />
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="space-y-3 border-t bg-white px-4 py-3 md:hidden">
          <Input type="text" placeholder="Search..." className="w-full" />

          <div className="flex flex-col gap-2 text-sm font-medium">
            {navItems.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1 py-1",
                  isActive(href) ? "text-blue-600" : "text-gray-700 hover:text-blue-500",
                )}
              >
                {icon}
                {label}
              </Link>
            ))}

            <SignedOut>
              <Button className="w-full">Iniciar Sesión</Button>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
}
