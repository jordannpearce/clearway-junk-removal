import type { City } from "@/lib/cities";
import { services } from "@/lib/services";

export function cityCopy(city: City) {
  const countyPhrase =
    city.county === "Alameda"
      ? "Alameda County"
      : "Contra Costa County";
  const neighbors = city.nearby.slice(0, 3).join(", ");
  const serviceList = services
    .slice(0, 5)
    .map((service) => service.shortName.toLowerCase())
    .join(", ");

  return {
    heroKicker: `${city.name}, ${countyPhrase}`,
    headline: `Junk hauling and debris removal in ${city.name}, California`,
    lede: `Clearway Junk Removal helps ${city.name} residents, landlords, and job sites clear space with the same careful crews that start their week in Hayward. ${city.character}`,
    whyHere: `Families in ${city.name} call when a garage has stopped being a garage, when a remodel pile blocks a driveway, or when a house needs a respectful reset. ${city.housing} Those buildings shape how we quote and how we park. We would rather spend two extra minutes planning the carry than scrape a stair, block a neighbor, or guess at volume.`,
    process: `When you set ${city.name} as your location, dispatch looks first at technicians already working ${countyPhrase}. The closest available crew gets the ticket, you receive a window, and the technician texts before arrival. You can follow the job, edit the notes, or cancel from your account. The team on the truck is notified the same way you are.`,
    materials: `In ${city.name} we regularly haul ${serviceList}, plus e-waste and commercial leftovers. If your pile sits near ${city.landmark}, tell us about parking and access. Nearby communities such as ${neighbors} often share the same truck route, which is why same-day windows still appear on busy East Bay afternoons.`,
    sentiment: `People in ${city.name} tell us the best part is not the empty driveway. It is the feeling that someone local handled the heavy part with respect. We are proud to be that crew. Hayward is home, and ${city.name} is a place we already know how to serve well.`,
    faqs: [
      {
        q: `Do you offer same-day junk removal in ${city.name}?`,
        a: `Often yes, especially when a technician is already in ${countyPhrase}. Set your location to ${city.name} and we will show the closest tech and the next honest window instead of a generic promise.`,
      },
      {
        q: `What parts of ${city.name} do you serve?`,
        a: `All of them. ${city.character} If a street is gated or steep, send a note with the booking so we bring the right truck.`,
      },
      {
        q: `Can a ${city.name} customer track the job?`,
        a: `Yes. Sign in to see status, the assigned technician, and options to edit or cancel. Dispatch and the crew receive email through Resend, and SMS if you have a phone provider connected.`,
      },
    ],
  };
}
