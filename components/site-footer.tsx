import Link from "next/link";
import { citiesByCounty } from "@/lib/cities";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

export function SiteFooter() {
  const alameda = citiesByCounty("Alameda");
  const contra = citiesByCounty("Contra Costa");

  return (
    <footer className="mt-auto border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-heading text-2xl font-semibold">{site.name}</p>
          <p className="mt-3 text-sm text-primary-foreground/80">
            {site.address}, {site.city}, {site.stateAbbr} {site.zip}
          </p>
          <p className="mt-2 text-sm">
            <a href={`tel:${site.phoneTel}`} className="underline-offset-4 hover:underline">
              {site.phone}
            </a>
            <br />
            <a href={`mailto:${site.email}`} className="underline-offset-4 hover:underline">
              {site.email}
            </a>
          </p>
          <p className="mt-3 text-sm text-primary-foreground/80">{site.hours}</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/70">Visit</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/schedule" className="hover:underline">Schedule a haul</Link></li>
            <li><Link href="/location" className="hover:underline">Set your location</Link></li>
            <li><Link href="/login" className="hover:underline">Customer or team sign in</Link></li>
            <li><Link href="/guides" className="hover:underline">How-to guides</Link></li>
            <li><Link href="/privacy" className="hover:underline">Privacy</Link></li>
            <li><Link href="/terms" className="hover:underline">Terms of service</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/70">Services</p>
          <ul className="mt-3 space-y-2 text-sm">
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={`/services/${service.slug}`} className="hover:underline">
                  {service.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-foreground/70">Counties we cover</p>
          <p className="mt-3 text-sm text-primary-foreground/80">
            {alameda.length} communities in Alameda County and {contra.length} in Contra Costa County, including every incorporated city.
          </p>
          <Link href="/service-areas" className="mt-3 inline-block text-sm underline underline-offset-4">
            Browse every city we serve
          </Link>
        </div>
      </div>
      <div className="border-t border-primary-foreground/15">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-primary-foreground/70 sm:px-6">
          © {new Date().getFullYear()} {site.name}. Local junk hauling from Hayward, California. No schema markup is embedded on this site by design.
        </p>
      </div>
    </footer>
  );
}
