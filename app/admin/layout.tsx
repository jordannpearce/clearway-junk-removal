import Link from "next/link";
import { redirect } from "next/navigation";
import { Shield } from "lucide-react";
import { logoutAction } from "@/lib/actions";
import { hasStaffAccount } from "@/lib/accounts";
import { getSession } from "@/lib/auth";
import { FormSubmit } from "@/components/form-submit";

export const dynamic = "force-dynamic";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/people", label: "People" },
  { href: "/admin/email", label: "Email" },
  { href: "/admin/sms", label: "SMS" },
  { href: "/admin/calls", label: "Calls" },
  { href: "/admin/notifications", label: "Notifications" },
  { href: "/ops", label: "Dispatch board" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const staffReady = await hasStaffAccount();
  if (!staffReady) {
    return <div className="min-h-full flex-1 bg-muted/30">{children}</div>;
  }
  if (!session || (session.role !== "admin" && session.role !== "ops")) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-full flex-1">
      <aside className="hidden w-64 shrink-0 bg-sidebar text-sidebar-foreground md:flex md:flex-col">
        <div className="flex items-center gap-2 px-5 py-5">
          <Shield className="size-5" />
          <div>
            <p className="font-heading text-lg">Clearway Admin</p>
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
          <FormSubmit variant="secondary" className="w-full">
            Sign out
          </FormSubmit>
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
