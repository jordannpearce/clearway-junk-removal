export const site = {
  name: "Clearway Junk Removal",
  shortName: "Clearway",
  tagline: "Careful junk hauling and debris removal from Hayward across the East Bay",
  city: "Hayward",
  state: "California",
  stateAbbr: "CA",
  address: "22650 Main Street",
  zip: "94541",
  phone: "(510) 555-0192",
  phoneTel: "+15105550192",
  email: "hello@clearwayjunk.com",
  opsEmail: "ops@clearwayjunk.com",
  hours: "7:00 a.m. to 7:00 p.m., seven days a week",
  founded: 2014,
  url: "https://clearwayjunk.local",
  description:
    "Clearway Junk Removal is a Hayward, California junk hauling and debris removal company that helps homeowners, landlords, and job sites across Alameda County and Contra Costa County clear space with same-day crews, careful handling, and responsible recycling.",
} as const;

export function publicSiteUrl() {
  const fromEnv = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    return `https://${process.env.RAILWAY_PUBLIC_DOMAIN.replace(/\/$/, "")}`;
  }
  return "http://127.0.0.1:43123";
}

export const demoAccounts = {
  customer: { email: "customer@clearwayjunk.com", password: "customer123", name: "Jordan Hale" },
  ops: { email: "ops@clearwayjunk.com", password: "ops123", name: "Maya Chen" },
  tech: { email: "tech@clearwayjunk.com", password: "tech123", name: "Andre Ruiz" },
} as const;
