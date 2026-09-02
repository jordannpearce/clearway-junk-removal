export type Service = {
  slug: string;
  name: string;
  shortName: string;
  image: string;
  summary: string;
  intro: string;
  whatWeHaul: string[];
  process: string[];
  localNote: string;
  faqs: { q: string; a: string }[];
  related: string[];
};

export const services: Service[] = [
  {
    slug: "household-junk-removal",
    name: "Household junk removal",
    shortName: "Household junk",
    image: "/images/service-household-junk.png",
    summary:
      "Whole-home cleanouts, room-by-room pickup, and same-day household junk hauling for Hayward and East Bay homes.",
    intro:
      "Household junk removal is the service most Hayward families call us for first. When a spare room fills with boxes, a move leaves leftovers, or a home simply needs breathing room, our crew arrives with a truck, dollies, and a calm plan. We lift the heavy pieces, sort what can be donated, and leave the space swept. People often tell us they felt lighter the same afternoon, and that is exactly the feeling we work toward.",
    whatWeHaul: [
      "Couches, chairs, tables, and bedroom sets",
      "Boxes of household goods, toys, and clutter",
      "Mattresses, box springs, and old bedding",
      "Kitchen castoffs, pantry overflow, and small appliances",
      "Office leftovers stored in a spare room",
      "Items left after a roommate move-out",
    ],
    process: [
      "Share photos or a room list so we can size the truck fairly.",
      "We confirm a arrival window and send the nearest available technician.",
      "The crew walks the space with you, then loads only what you want gone.",
      "We sweep the area, recycle or donate when we can, and send a receipt.",
    ],
    localNote:
      "In Hayward neighborhoods such as Burbank, Harder-Tennyson, and the hills above Mission Boulevard, driveway access and HOA timing matter. We plan the truck path before we start so neighbors stay comfortable and the street stays clear.",
    faqs: [
      {
        q: "Can you take junk from more than one room in a single visit?",
        a: "Yes. Most household jobs include several rooms. Tell us what you want cleared and we price by volume, not by how many doorways we walk through.",
      },
      {
        q: "Do I need to carry items to the curb?",
        a: "No. Our technicians come inside, upstairs, or into the garage. You point, we haul. That is the difference people notice first.",
      },
    ],
    related: ["garage-cleanout", "furniture-removal", "estate-cleanout"],
  },
  {
    slug: "construction-debris-removal",
    name: "Construction debris removal",
    shortName: "Construction debris",
    image: "/images/service-construction-debris.png",
    summary:
      "Drywall, lumber, tile, and remodel waste hauled from East Bay job sites without leaving a dumpster in the driveway for a week.",
    intro:
      "Construction debris removal helps remodelers, homeowners, and property managers keep a job moving. A kitchen tear-out in Castro Valley or a bathroom rebuild in Concord can fill a garage overnight. Instead of waiting on a dumpster delivery, you schedule a Clearway truck, we load the pile, and the crew can keep working. Contractors appreciate that we arrive on a clock and leave the driveway open.",
    whatWeHaul: [
      "Drywall, plaster, and painted wood",
      "Lumber offcuts, pallets, and trim",
      "Tile, grout bags, and vanity tear-outs",
      "Carpet, pad, and old underlayment",
      "Cabinets, countertops, and sink remnants",
      "Bagged remodel waste from a single trade",
    ],
    process: [
      "Tell us the material mix so we can plan recycling versus landfill.",
      "We stage the truck close to the pile and protect floors and landscaping.",
      "Crews load by hand or with a walkboard, then tarp the bed.",
      "You get a clean pad or driveway and a note of what we hauled.",
    ],
    localNote:
      "Alameda County and Contra Costa County both encourage source separation. When a pile is mostly clean wood or metal, we route it toward recycling partners rather than treating every board as trash.",
    faqs: [
      {
        q: "Is this cheaper than renting a dumpster?",
        a: "For many one-day tear-outs, yes. You avoid rental days, permit questions, and the risk of neighbors filling the box. Large multi-week jobs can still use a dumpster; we are glad to help you compare.",
      },
      {
        q: "Can you take concrete or dirt?",
        a: "Small amounts of broken concrete or tile are usually fine. Full truckloads of dirt, rock, or wet concrete need a different plan. Call us and we will be honest about what fits.",
      },
    ],
    related: ["commercial-junk-removal", "yard-waste-removal", "household-junk-removal"],
  },
  {
    slug: "estate-cleanout",
    name: "Estate cleanout",
    shortName: "Estate cleanout",
    image: "/images/service-estate-cleanout.png",
    summary:
      "Respectful whole-home estate and hoarding-adjacent cleanouts for families settling a house in Hayward, Oakland, Walnut Creek, and nearby cities.",
    intro:
      "An estate cleanout is never only a hauling job. Families call us after a parent moves to care, after a sale is pending, or when a house has sat quiet for too long. We walk slowly, listen, and sort with care. Treasured photos stay on the table. Donation-worthy furniture goes to local partners. The rest leaves on our truck so the house can be shown, sold, or simply lived in again.",
    whatWeHaul: [
      "Full-home contents after a move or passing",
      "Attic, basement, and garage overflow",
      "Furniture that no longer serves the next chapter",
      "Kitchenware, linens, and packed closets",
      "Outdoor items left in a yard or shed",
      "Paper, magazines, and recyclable clutter",
    ],
    process: [
      "We schedule a walkthrough, in person or by photos, so the family sets the pace.",
      "A dedicated crew lead stays in contact with the decision maker on site.",
      "We sort keep, donate, recycle, and haul piles before anything leaves the house.",
      "Rooms are left broom-clean so a realtor, painter, or relative can step in next.",
    ],
    localNote:
      "East Bay estates often include older hillside homes in Oakland, ranch houses in Hayward, and mid-century properties in Walnut Creek. Stairs, narrow drives, and long carry distances are normal for us. We price that honestly instead of surprising you at the door.",
    faqs: [
      {
        q: "Can you work around items the family still wants to keep?",
        a: "Always. We tape off rooms, label keep piles, and will not touch a marked box. That respect is the first thing we train.",
      },
      {
        q: "How long does a whole-house cleanout take?",
        a: "A typical three-bedroom home is often one full day with a two-person crew. Larger or more packed homes may take two visits. We tell you that before we start.",
      },
    ],
    related: ["household-junk-removal", "garage-cleanout", "furniture-removal"],
  },
  {
    slug: "appliance-removal",
    name: "Appliance removal",
    shortName: "Appliances",
    image: "/images/service-appliance-removal.png",
    summary:
      "Refrigerator, washer, dryer, stove, and water heater haul-away with careful disconnect checks for East Bay homes and rentals.",
    intro:
      "Appliance removal looks simple until you try to pivot a dead refrigerator around a tight Hayward hallway. Our technicians bring straps, dollies, and the patience to protect floors and doorframes. We haul refrigerators, washers, dryers, ranges, dishwashers, and many water heaters. When an item still has value, we ask about donation. When it is spent, we take it to a recycler that handles refrigerant the right way.",
    whatWeHaul: [
      "Refrigerators and freezers",
      "Washers and dryers",
      "Stoves, ovens, and cooktops",
      "Dishwashers and compactors",
      "Window air conditioners",
      "Many water heaters and shop appliances",
    ],
    process: [
      "Confirm the appliance is unplugged and, if needed, disconnected by your plumber or installer.",
      "We protect floors, walk the path, and load the unit without rushing corners.",
      "Freon-bearing units go to a recycler that can recover refrigerant.",
      "You get the space back the same visit.",
    ],
    localNote:
      "Many East Bay rentals turn over in summer. Landlords in Union City, San Leandro, and Concord often book appliance swaps the same week a new tenant arrives. We keep a few afternoon windows open for that rush.",
    faqs: [
      {
        q: "Do you disconnect gas or water lines?",
        a: "We do not open gas lines. If a plumber or installer has already disconnected the unit, we haul it. Safety for your home comes first.",
      },
      {
        q: "Can you take a refrigerator that still has food in it?",
        a: "Please empty it first. A clean, defrosted fridge is safer to move and kinder to the crew and the truck.",
      },
    ],
    related: ["furniture-removal", "e-waste-pickup", "household-junk-removal"],
  },
  {
    slug: "yard-waste-removal",
    name: "Yard waste and green debris",
    shortName: "Yard waste",
    image: "/images/service-yard-waste.png",
    summary:
      "Brush, branches, fencing, and storm debris hauled from East Bay yards, hillsides, and after weekend cleanups.",
    intro:
      "Yard waste removal is a spring and fall favorite across Hayward, Castro Valley, and the Lamorinda hills. After a pruning weekend or a windstorm, green piles sit at the curb longer than anyone wants. We load branches, brush, old fencing, and garden leftovers, then route clean green material toward composting when the load allows. The yard looks cared for again, and you do not spend a Sunday stuffing a city cart.",
    whatWeHaul: [
      "Branches, brush, and shrub trimmings",
      "Old wood fencing and garden beds",
      "Fallen limbs after a storm",
      "Dirt-mixed garden waste in modest amounts",
      "Broken patio furniture and planters",
      "Leaves bagged after a cleanup day",
    ],
    process: [
      "Pile material in one accessible spot when you can. We can also gather from the yard.",
      "We load green waste separately from mixed junk so more of it can be composted.",
      "Nails, wire, and treated wood are sorted out of the green stream.",
      "The curb or driveway is left clear.",
    ],
    localNote:
      "Hillside streets in Fairview, Castro Valley, and Orinda can be tight. We send a truck that fits the block and will not block a fire lane while we load.",
    faqs: [
      {
        q: "Do you take dirt, rock, or sod?",
        a: "Small mixed amounts are often fine. Full loads of soil or rock need a different truck. Tell us the mix and we will price it fairly or point you to a better option.",
      },
      {
        q: "Can you haul after a contractor trims trees?",
        a: "Yes. Tree services sometimes leave a pile. We come after they finish and clear the street so you can enjoy the work they did.",
      },
    ],
    related: ["construction-debris-removal", "household-junk-removal", "garage-cleanout"],
  },
  {
    slug: "furniture-removal",
    name: "Furniture removal",
    shortName: "Furniture",
    image: "/images/service-furniture.png",
    summary:
      "Couch, mattress, dining set, and office furniture haul-away for apartments, homes, and staging turnovers across the East Bay.",
    intro:
      "Furniture removal is one of the fastest ways to reset a room. A sofa that no longer fits, a mattress that has done its years, or a dining set left after a move can stall a whole house. We carry pieces down stairs, out of elevators, and around tight Oakland apartment corners. When a piece is still in good shape, we try donation first. When it is not, it leaves the same day.",
    whatWeHaul: [
      "Sofas, sectionals, and recliners",
      "Mattresses and box springs",
      "Dining tables, chairs, and hutches",
      "Dressers, desks, and bookshelves",
      "Patio sets and heavy wood pieces",
      "Office furniture from a home studio",
    ],
    process: [
      "Send a photo so we can plan stairs, elevators, and crew size.",
      "We protect walls and floors on the path out.",
      "Donation-ready items are set aside when a local partner can take them that day.",
      "The room is left open and ready for the next piece or a deep clean.",
    ],
    localNote:
      "Apartment buildings in downtown Oakland, Emeryville, Berkeley, and Walnut Creek often have loading rules. We work with your building office so the elevator reservation and the truck arrive together.",
    faqs: [
      {
        q: "Do you take a sofa if it is stained or torn?",
        a: "Yes. Condition does not stop a haul. It only changes whether we donate or recycle the materials.",
      },
      {
        q: "Can you disassemble a bed frame?",
        a: "We can break down most standard frames and tables. Antique or built-in pieces may need extra time, which we will flag when we see the photo.",
      },
    ],
    related: ["household-junk-removal", "appliance-removal", "estate-cleanout"],
  },
  {
    slug: "garage-cleanout",
    name: "Garage and storage cleanout",
    shortName: "Garage cleanout",
    image: "/images/service-garage-cleanout.png",
    summary:
      "Garage, shed, and storage-unit cleanouts so East Bay families can park again, sell a house, or finally use the space.",
    intro:
      "A garage cleanout is often the moment a house starts to feel finished. Tools, holiday bins, sports gear, and forgotten projects stack until the car lives on the street. We sort with you or work from a keep-versus-go list, then haul the rest. Families in Hayward, San Lorenzo, and Antioch tell us the best part is pulling into the garage that night.",
    whatWeHaul: [
      "Boxed clutter and plastic totes you no longer need",
      "Old tools, paint cans in limited quantities, and workbench leftovers",
      "Bikes, scooters, and sports equipment",
      "Broken shelves, cabinets, and leftover flooring",
      "Holiday decorations past their season",
      "Shed and side-yard overflow",
    ],
    process: [
      "Walk the garage together or send a keep list ahead of time.",
      "We make a donate pile, a recycle pile, and a haul pile.",
      "The floor is swept so you can see the space you recovered.",
      "If you want, we can return another day for the attic or shed.",
    ],
    localNote:
      "Many East Bay homes have long, narrow garages from the 1950s and 1960s. We expect tight turns and will not scrape a water heater or a parked car to get a dresser out.",
    faqs: [
      {
        q: "What about paint, oil, or chemicals?",
        a: "Household hazardous waste has special rules in Alameda and Contra Costa counties. We can take empty cans and many sealed latex leftovers in small amounts, and we will tell you what must go to a county drop-off instead.",
      },
      {
        q: "Can you clean a storage unit on the same trip?",
        a: "Yes, if it is in our service area. Livermore, Dublin, and San Ramon units are a regular part of our week.",
      },
    ],
    related: ["household-junk-removal", "estate-cleanout", "e-waste-pickup"],
  },
  {
    slug: "commercial-junk-removal",
    name: "Commercial junk removal",
    shortName: "Commercial",
    image: "/images/service-commercial.png",
    summary:
      "Office, retail, and light-industrial cleanouts for East Bay businesses that need a truck on a schedule, not a week-long dumpster.",
    intro:
      "Commercial junk removal keeps a shop, office, or warehouse usable. When a tenant leaves a suite on Mission Boulevard or a cafe in Walnut Creek swaps furniture, the leftover pile can stall the next lease. We work before opening hours when you need us to, haul fixtures and furniture, and keep the sidewalk clear for customers. Property managers like that one visit can close out a unit.",
    whatWeHaul: [
      "Desks, cubicles, and conference tables",
      "Retail fixtures, racks, and signage",
      "Warehouse pallets and packaging",
      "Break-room appliances and leftover inventory packaging",
      "Construction leftovers from a tenant improvement",
      "File cabinets and mixed office clutter",
    ],
    process: [
      "A dispatcher confirms access hours, loading docks, and certificates of insurance if your building requires them.",
      "We arrive in the window you reserved and check in with on-site staff.",
      "The crew loads, protects common areas, and leaves the suite broom-clean.",
      "You receive a job record you can attach to a lease file.",
    ],
    localNote:
      "We regularly work industrial pockets in Hayward, San Leandro, Fremont, Pittsburg, and Richmond. If your building needs after-hours work or a COI, say so when you book. We keep those documents ready.",
    faqs: [
      {
        q: "Can you haul on a recurring route?",
        a: "Yes. Some shops book a monthly sweep. Recurring work helps us send the same technician who already knows your dock.",
      },
      {
        q: "Do you take pallets and cardboard only?",
        a: "We can. If the load is clean cardboard or pallets, we route it toward recycling instead of mixed waste.",
      },
    ],
    related: ["construction-debris-removal", "e-waste-pickup", "furniture-removal"],
  },
  {
    slug: "e-waste-pickup",
    name: "E-waste and electronics pickup",
    shortName: "E-waste",
    image: "/images/service-ewaste.png",
    summary:
      "TV, computer, printer, and electronics pickup with responsible recycling for homes and offices in Alameda and Contra Costa counties.",
    intro:
      "E-waste pickup solves a pile that city carts will not take. Televisions, monitors, printers, and tangled cords collect in a closet until someone decides the house deserves better. We collect electronics from the room they live in, keep them out of the regular trash, and deliver them to recyclers that handle glass, boards, and batteries properly. It is a quiet service that prevents a messy problem later.",
    whatWeHaul: [
      "Televisions and computer monitors",
      "Desktops, laptops, and towers",
      "Printers, scanners, and copiers",
      "Stereos, speakers, and game consoles",
      "Cables, power supplies, and peripherals",
      "Small electronics and office tech leftovers",
    ],
    process: [
      "List the devices so we can plan weight and recycling partners.",
      "We pick up from inside the home or office. No curb-only rule.",
      "Data-bearing devices can be set aside if you still need a drive pulled. We do not wipe drives unless you ask us to note that the device is headed to certified recycling.",
      "You get confirmation that the load left as e-waste, not mixed trash.",
    ],
    localNote:
      "California treats many screens as covered electronic waste. We stay aligned with that intent so Hayward and East Bay customers are not left guessing which Saturday drop-off to visit.",
    faqs: [
      {
        q: "Will you take a cracked television?",
        a: "Yes. Cracked screens are a common reason people call. We handle the glass carefully and recycle it as e-waste.",
      },
      {
        q: "Can you destroy a hard drive?",
        a: "We can note that a device is going to a recycler. For certified destruction, say so when you book and we will tell you what we can arrange.",
      },
    ],
    related: ["appliance-removal", "commercial-junk-removal", "garage-cleanout"],
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
