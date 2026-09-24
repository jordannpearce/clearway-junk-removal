import { site } from "@/lib/site";
import type { EmailKind } from "@/lib/types";

export const emailKinds: { value: EmailKind; label: string; description: string }[] = [
  { value: "marketing", label: "Marketing", description: "Offers, seasonal cleanout reminders, and neighborhood campaigns." },
  { value: "welcome", label: "Welcome", description: "First note after someone joins or books with Clearway." },
  { value: "account_opening", label: "Account opening", description: "Login details and what the customer or staff account can do." },
  { value: "notification", label: "Notification", description: "Job updates, schedule changes, and yard notices." },
  { value: "review", label: "Review request", description: "Ask for a review after a completed haul." },
];

export function defaultEmailCopy(kind: EmailKind, name = "there") {
  const greeting = `Hi ${name},`;
  switch (kind) {
    case "marketing":
      return {
        subject: `Clear space this week with ${site.shortName} in Hayward`,
        body: `${greeting}\n\nHayward driveways fill up fast. If you have a garage stall, estate pile, or remodel debris sitting in Alameda or Contra Costa County, we can put a same-day crew on it.\n\nReply with your city and a photo, or call ${site.phone}. We recycle what we can and leave the spot swept.\n\n${site.name}\n${site.address}, ${site.city}, ${site.stateAbbr} ${site.zip}`,
      };
    case "welcome":
      return {
        subject: `Welcome to ${site.name}`,
        body: `${greeting}\n\nGlad you are with Clearway. You can schedule a haul, set your city for the closest technician, and track the job from your account.\n\nIf the pile is already in the driveway, call ${site.phone}. Otherwise reply to this note or book at ${site.url}/schedule.\n\nSee you on the curb.\n${site.name}`,
      };
    case "account_opening":
      return {
        subject: `Your ${site.shortName} account is open`,
        body: `${greeting}\n\nAn account is ready for you at ${site.url}/login. Use this email address to sign in. If you were given a temporary password, change it after the first visit.\n\nCustomers can track, edit, and cancel hauls. Dispatch and technicians open the operations board. Write ${site.email} if anything looks off.\n\n${site.name}\n${site.phone}`,
      };
    case "review":
      return {
        subject: "How did Clearway do on your junk haul?",
        body: `${greeting}\n\nYour haul is complete, and we would be grateful for a short review. Tell us what felt careful, what we could improve, and whether you would call us again.\n\nThank you for trusting a Hayward crew.\n${site.name}\n${site.phone}`,
      };
    default:
      return {
        subject: `A note from ${site.name}`,
        body: `${greeting}\n\nThis is a Clearway notification about your account or a scheduled haul. If you were not expecting it, call ${site.phone} and ask for dispatch.\n\n${site.name}`,
      };
  }
}

export function applyTemplate(text: string, values: Record<string, string>) {
  return Object.entries(values).reduce((body, [key, value]) => body.replaceAll(`{{${key}}}`, value), text);
}
