import Link from "next/link";
import { redirect } from "next/navigation";
import { Truck } from "lucide-react";
import { logoutAction } from "@/lib/actions";
import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const links = [
  { href: "/ops", label: "Overview" },
  { href: "/ops/jobs", label: "Jobs" },
  { href: "/ops/dispatch", label: "Dispatch" },
  { href: "/ops/schedule", label: "Schedule" },
  { href: "/ops/technicians", label: "Technicians" },
  { href: "/ops/reviews", label: "Review requests" },
];

export default async function OpsLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || (session.role !== "ops" && session.role !== "tech")) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-full flex-1">
      <aside className="hidden w-64 shrink-0 bg-sidebar text-sidebar-foreground md:flex md:flex-col">
        <div className="flex items-center gap-2 px-5 py-5">
          <Truck className="size-5" />
          <div>
            <p className="font-heading text-lg">Clearway Ops</p>
            <p className="text-xs text-sidebar-foreground/70">{session.name}</p>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 text-sm hover:bg-sidebar-accent">
              {link.label}
            </Link>
          ))}
          <Link href="/" className="rounded-lg px-3 py-2 text-sm hover:bg-sidebar-accent">
            Public site
          </Link>
        </nav>
        <form action={logoutAction} className="p-4">
          <Button type="submit" variant="secondary" className="w-full">
            Sign out
          </Button>
        </form>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3 overflow-x-auto border-b border-border px-4 py-3 md:hidden">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm whitespace-nowrap">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex-1 bg-muted/30">{children}</div>
      </div>
    </div>
  );
}
