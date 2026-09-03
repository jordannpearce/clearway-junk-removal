import Link from "next/link";
import { MapPin, Phone, Truck } from "lucide-react";
import { LinkButton } from "@/components/link-button";
import { getSession } from "@/lib/auth";
import { getSavedLocation } from "@/lib/location-cookie";
import { site } from "@/lib/site";
import { MobileNav } from "@/components/mobile-nav";

const links = [
  { href: "/services", label: "Services" },
  { href: "/service-areas", label: "Service areas" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export async function SiteHeader() {
  const session = await getSession();
  const location = await getSavedLocation();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="border-b border-primary/15 bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-1.5 text-xs sm:px-6">
          <p className="flex items-center gap-1.5">
            <Truck className="size-3.5" />
            Hayward home yard · Alameda & Contra Costa Counties
          </p>
          <a href={`tel:${site.phoneTel}`} className="flex items-center gap-1.5 font-medium">
            <Phone className="size-3.5" />
            {site.phone}
          </a>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Truck className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-heading text-lg font-semibold tracking-tight">{site.shortName}</span>
            <span className="block text-[11px] text-muted-foreground">Junk Removal · Hayward, CA</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-foreground/80 hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LinkButton href="/location" variant="ghost" size="sm" className="hidden md:inline-flex">
            <MapPin className="size-3.5" />
            {location?.city || "Set location"}
          </LinkButton>
          {session ? (
            <LinkButton href={session.role === "customer" ? "/account" : "/ops"} size="sm">
              {session.role === "customer" ? "My jobs" : "Dispatch"}
            </LinkButton>
          ) : (
            <LinkButton href="/login" variant="outline" size="sm" className="hidden sm:inline-flex">
              Sign in
            </LinkButton>
          )}
          <LinkButton href="/schedule" size="sm">
            Schedule
          </LinkButton>
          <MobileNav signedIn={Boolean(session)} role={session?.role} city={location?.city} />
        </div>
      </div>
    </header>
  );
}
