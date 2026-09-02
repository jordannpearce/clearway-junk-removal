"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { UserRole } from "@/lib/types";

const links = [
  { href: "/services", label: "Services" },
  { href: "/service-areas", label: "Service areas" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "/location", label: "Set location" },
  { href: "/schedule", label: "Schedule a haul" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function MobileNav({
  signedIn,
  role,
  city,
}: {
  signedIn: boolean;
  role?: UserRole;
  city?: string;
}) {
  return (
    <Sheet>
      <SheetTrigger
        className="lg:hidden"
        render={<Button variant="outline" size="icon-sm" aria-label="Open menu" />}
      >
        <Menu className="size-4" />
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>Clearway menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-3 px-4 pb-6">
          <p className="text-sm text-muted-foreground">
            {city ? `Closest tech search is set to ${city}.` : "Set a city so we can match the nearest technician."}
          </p>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-base font-medium">
              {link.label}
            </Link>
          ))}
          <Link href={signedIn ? (role === "customer" ? "/account" : "/ops") : "/login"} className="text-base font-medium">
            {signedIn ? (role === "customer" ? "My jobs" : "Ops dashboard") : "Sign in"}
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
