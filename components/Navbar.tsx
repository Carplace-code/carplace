"use client";

import { Car, Heart, LineChart, Menu, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

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
          <Link href="/" className="text-blue-600">
            Home
          </Link>
          <Link href="/browse">Browse</Link>
          <Link href="/wishlist" className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            Wishlist
          </Link>
          <Link href="/trends" className="flex items-center gap-1">
            <LineChart className="h-4 w-4" />
            Trends
          </Link>
          <Button>Sign In</Button>
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
            <Link href="/" className="text-blue-600">
              Home
            </Link>
            <Link href="/browse">Browse</Link>
            <Link href="/wishlist" className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              Wishlist
            </Link>
            <Link href="/trends" className="flex items-center gap-1">
              <LineChart className="h-4 w-4" />
              Trends
            </Link>
            <Button className="w-full">Sign In</Button>
          </div>
        </div>
      )}
    </nav>
  );
}
