export type Guide = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readMinutes: number;
  paragraphs: string[];
  questions: { q: string; a: string }[];
};

export const guides: Guide[] = [
  {
    slug: "how-to-prepare-for-junk-removal",
    title: "How to prepare for junk removal in Hayward and the East Bay",
    excerpt:
      "A calm, practical checklist so your Clearway crew can load faster, price fairly, and leave your rooms ready to use.",
    category: "Getting ready",
    readMinutes: 8,
    paragraphs: [
      "Preparing for junk removal is less about making the house perfect and more about making decisions before the truck arrives. When a Hayward family walks a room the night before and marks what stays, the visit feels easy. The crew spends time lifting, not guessing. You spend time watching a space open up, not answering the same question in every doorway.",
      "Start with a single list. Write the rooms you want cleared and the items you are sure about. If you are unsure about a dresser or a box of records, put a piece of tape on it that says decide. Our technicians will ask once and move on. That small habit prevents a keep-pile from being hauled by mistake, which is the outcome nobody wants.",
      "Photos help more than people expect. A picture of a packed garage in Castro Valley or a stairwell in Oakland tells us whether we need two people, extra blankets, or a second trip. You do not need a perfect album. Four or five images from the doorway are enough for a fair quote and a crew that arrives ready.",
      "Clear a path if you can. We will still carry items from the back of a shed, but a walkway through the garage or a hallway without a leaning bike makes the work safer. Pets are happier in a closed room. Cars parked on the street instead of the driveway give the truck a place to stand without blocking a neighbor.",
      "If the job includes appliances, empty the refrigerator and confirm gas or water lines are already disconnected by the right trade. If the job includes paint or chemicals, set those aside. Alameda County and Contra Costa County both have household hazardous waste rules, and we would rather tell you the honest drop-off path than pretend every can belongs on a junk truck.",
      "The last kind thing you can do for yourself is decide what success looks like. Some people want one bedroom empty for guests. Some want a whole estate ready for a realtor. Tell us that goal. We will match the truck size and the time window so the day feels like progress, not a scramble.",
    ],
    questions: [
      {
        q: "Do I need to box everything before you arrive?",
        a: "No. Loose items are fine. Boxing helps only when you want to keep a category together or protect something fragile you are still deciding on.",
      },
      {
        q: "What if I change my mind about an item on site?",
        a: "Say so before it goes on the truck. Once a piece is loaded and we leave, it is headed to donation or disposal. We would rather pause for ten seconds than lose something you still want.",
      },
    ],
  },
  {
    slug: "what-we-can-and-cannot-haul",
    title: "What East Bay junk haulers can take, and what must stay behind",
    excerpt:
      "A plain-language guide to household junk, remodel debris, e-waste, and the few materials that need a county drop-off instead.",
    category: "Materials",
    readMinutes: 7,
    paragraphs: [
      "People call because they want a straight answer: will you take this? In most Hayward homes the answer is yes. Furniture, household clutter, appliances, yard piles, remodel leftovers, and electronics are the core of our week. The short list of no items exists to protect your soil, our crew, and the facilities that receive the load.",
      "We gladly haul couches, mattresses, desks, toys, boxes, garage overflow, fencing, branches, drywall, cabinets, televisions, and most appliances. If you can point to it and it is not hazardous, there is a good chance it leaves with us. Volume sets the price, not how sentimental the object used to be.",
      "We are careful with paint, oils, pesticides, propane, and medical waste. Children and pets live in the same counties we work. When a sealed latex can is mixed into a small household load, we can often help. When a garage holds a decade of unlabeled chemicals, the kindest path is a county household hazardous waste appointment. We will tell you that clearly instead of hiding it in fine print.",
      "Dirt, rock, and wet concrete have weight that a furniture truck is not built to carry all day. A few broken tiles from a bathroom job are normal. A full driveway tear-out is a different conversation. We would rather send the right truck or decline than damage a street or a suspension.",
      "Electronics are welcome. Screens, computers, and printers should not sit in a regular trash can in California, and we treat them as e-waste. If you still need files off a computer, pull the drive first. We can wait while you do that. We cannot promise forensic destruction unless you ask us to arrange it.",
      "The positive way to read this list is simple. Almost everything that is making your house feel stuck can leave. The few exceptions exist so the rest of the work stays safe and legal. If you are unsure, send a photo. A two-minute look saves a wasted window for both of us.",
    ],
    questions: [
      {
        q: "Can you take a piano?",
        a: "Some uprights, yes, with extra crew. Steinways and grand pianos need a piano mover. We will be honest when we see the photo.",
      },
      {
        q: "What about tires or batteries?",
        a: "A small number of car tires or household batteries can often be included. Large stacks belong at a recycler. Tell us the count.",
      },
    ],
  },
  {
    slug: "dumpster-rental-vs-junk-hauling",
    title: "Dumpster rental versus junk hauling in the East Bay",
    excerpt:
      "When a driveway dumpster helps, when a Clearway truck is kinder, and how Hayward homeowners usually decide.",
    category: "Planning",
    readMinutes: 6,
    paragraphs: [
      "A dumpster and a junk truck solve the same feeling: this pile is in my way. They do it on different clocks. A dumpster sits. A truck arrives, loads, and leaves. The right choice depends on how long the pile will grow and how much you want to handle yourself.",
      "Choose a dumpster when a remodel will last a week or more and the crew will keep adding debris. A kitchen in Concord that takes ten days can fill a box slowly. The rental fee starts to make sense when many trades throw scrap into the same place.",
      "Choose junk hauling when the pile already exists. A garage in San Lorenzo, a tenant leftover in Oakland, or a storm-branch stack in Castro Valley does not need a box living on the apron. You also avoid the quiet risk that neighbors add their own things overnight.",
      "Permits and HOAs matter in the East Bay. Some streets need a permit for a dumpster on the roadway. Some associations dislike a box in the driveway. A truck visit is usually treated as a delivery, not a fixture. That difference has saved more than one Hayward homeowner an awkward letter.",
      "Cost is not only the number on the quote. Your time loading a dumpster has value. Stairs have value. A Saturday you would rather spend at Lake Chabot has value. Families who do not want to lift often find that a full-service haul feels like the better purchase even when the line items look similar.",
      "We will tell you if a dumpster is the wiser tool. That honesty is part of why people call us back. The goal is a clear space, not a forced product.",
    ],
    questions: [
      {
        q: "Can you load a dumpster I already rented?",
        a: "Sometimes, as labor-only. Call us with the address and we will say if it fits the day.",
      },
      {
        q: "Do you leave a truck overnight?",
        a: "No. The truck comes, the pile leaves, and your driveway belongs to you again.",
      },
    ],
  },
  {
    slug: "estate-cleanout-checklist",
    title: "A respectful estate cleanout checklist for East Bay families",
    excerpt:
      "How to pace a house after a move or a loss, what to sort first, and how a local crew can help without rushing you.",
    category: "Estate",
    readMinutes: 9,
    paragraphs: [
      "An estate cleanout is a series of small decisions made in a house that still feels like someone. Families in Hayward, Walnut Creek, and Oakland often start with one room because the whole house is too much. That is a wise way to begin. You do not owe the calendar a heroic weekend.",
      "First, secure papers, jewelry, photos, and anything that would hurt to lose. Put them in one labeled bin in a locked room or a relative’s car. Hauling crews are careful, and we still want those items out of the path before dollies roll.",
      "Second, walk with one decision maker. Too many voices in a doorway slow the day and raise the temperature. If siblings need time, schedule a sort day before the truck day. We are glad to come back. We are not glad to watch a family argue over a lamp while a truck idles.",
      "Third, separate keep, donate, and haul with painter’s tape or signs. Donation-worthy furniture in the East Bay can still find a second home if it is clean and complete. We will route those pieces when partners can take them. The rest can leave without guilt. A house being prepared for sale is allowed to be lighter.",
      "Fourth, think about the next person who will enter. A realtor, a painter, or a tenant will thank you for broom-clean rooms and a working path to the water heater. Tell us if you need that standard. We sweep as part of the visit because a pile that becomes a film of dust is not a finished job.",
      "Fifth, give yourself a kind ending. When the last load leaves, stand in the living room for a minute. Many people feel a surprising quiet. That quiet is the point. The house can be shown, painted, or simply closed for the night. You did the hard part. We were glad to carry the weight.",
    ],
    questions: [
      {
        q: "Can you work while a family member is still living in part of the house?",
        a: "Yes. We tape off living spaces and work room by room. Tell us which bathroom and kitchen must stay usable.",
      },
      {
        q: "Do you buy antiques?",
        a: "We are haulers, not appraisers. If something looks valuable, we will pause so you can get a second opinion before it leaves.",
      },
    ],
  },
  {
    slug: "east-bay-recycling-and-donation",
    title: "How Clearway recycles and donates junk in Alameda and Contra Costa counties",
    excerpt:
      "Where household items, metal, e-waste, and clean wood go after they leave a Hayward driveway.",
    category: "Recycling",
    readMinutes: 7,
    paragraphs: [
      "Junk removal has a second life that customers rarely see. After a truck leaves a Hayward driveway, the load is not treated as a single anonymous pile. We sort on site when we can, then again at the yard, because metal, clean wood, electronics, and donation-ready furniture each have a better destination than a mixed landfill.",
      "Alameda County has long asked residents to think about what can be recovered. Contra Costa County has its own drop-off network and franchise rules. We work inside that landscape instead of against it. When a load is mostly metal, it goes toward scrap. When a sofa is still honest and clean, we try a donation partner before we give up on it.",
      "Electronics are kept out of the regular trash. Screens and computers belong with recyclers who can handle glass and boards. Appliances with refrigerant belong with people who can recover it. That extra step is part of why an appliance quote can differ from a dresser quote, and it is a difference we are proud of.",
      "Not every item can be saved. A soaked mattress, a crumbling particle-board desk, or remodel waste mixed with food trash has a shorter path. We will not pretend otherwise. Honest disposal is still better than a pile that sits for months and becomes a rodent problem for a neighbor.",
      "If you care deeply about diversion, tell us. We can slow down the sort, set extra donate piles, and give you a clearer report of where the load went. Families settling an estate often want that story. So do offices that report sustainability numbers. We are glad to help both.",
    ],
    questions: [
      {
        q: "Do you guarantee a diversion percentage?",
        a: "We do not print a fake number. We do sort with intent and will describe what we recovered after the job.",
      },
      {
        q: "Can I have a donation receipt?",
        a: "When a partner issues one, we pass it along. We cannot write a charitable receipt for items we simply haul.",
      },
    ],
  },
  {
    slug: "same-day-junk-hauling-how-it-works",
    title: "How same-day junk hauling works from Hayward",
    excerpt:
      "What happens between your call and a truck in the driveway, including how we pick the closest technician.",
    category: "Service",
    readMinutes: 6,
    paragraphs: [
      "Same-day junk hauling sounds like a promise that should be hard to keep. In the East Bay it works because we already live here. Trucks start in Hayward, Oakland, Fremont, Concord, and Richmond. When you set your location on this site, we look at who is closest and who is free, not at a national call center map.",
      "The morning board is a living thing. A garage job in San Leandro may finish early. A furniture haul in Walnut Creek may open a window in Lafayette. Dispatchers watch those gaps. If your request arrives before mid-afternoon and the pile fits a truck we already have in the county, we will offer a window the same day.",
      "You still get a real estimate. Same-day does not mean surprise pricing. Photos or a quick description let us size the load. If the pile is larger on arrival, we tell you before we add volume. People stay happy when the number and the work match.",
      "The technician you meet is the person who also texts when they are en route. That single thread is better than a maze of contractors. If you need to move a gate code or a pet, you are talking to the crew that is actually driving toward you.",
      "Same-day is a gift we protect by being honest when we cannot do it. A Friday at 5 p.m. in Discovery Bay may wait until morning. We would rather give you a first-window Saturday than a late, tired visit. Reliability is the sentiment we want attached to the Clearway name.",
    ],
    questions: [
      {
        q: "What time do same-day windows usually start?",
        a: "Late morning through late afternoon, depending on the county and the truck. Set your location and we will show the nearest tech’s typical coverage.",
      },
      {
        q: "Is same-day more expensive?",
        a: "The haul price is still by volume. A rush fee appears only when we must break a route or add a crew. We tell you before you confirm.",
      },
    ],
  },
  {
    slug: "junk-removal-pricing-east-bay",
    title: "How junk removal pricing works in Hayward and the East Bay",
    excerpt:
      "Truck volume, heavy materials, stairs, and why a photo quote is kinder than a vague phone number.",
    category: "Pricing",
    readMinutes: 7,
    paragraphs: [
      "Junk removal pricing should feel explainable. We charge primarily by how much of the truck you fill, then adjust for weight, stairs, and a few materials that cost more to dispose of. A quarter truck in a Hayward garage is a different job than a full truck of wet dirt in the hills, and the quote should read that way.",
      "Volume is the friendly part of the model. You can see it. A sofa and a few chairs are not a full truck. A packed two-car garage often is. When we send a photo estimate, we are matching your pile to that scale so you are not guessing.",
      "Weight changes the story for dirt, concrete, tile, and some remodel debris. Landfills and recyclers charge by the ton. We pass that through instead of hiding it. Light household junk stays on the simple volume ladder.",
      "Access matters because time matters. A third-floor Oakland walk-up is still a job we are glad to do. It is not the same as a Hayward driveway load. Long carries, locked gates, and HOA check-ins are priced as time, not as penalties.",
      "There is no benefit to a teaser price that doubles at the curb. We would rather send a slightly conservative estimate and come in under it. Positive reviews in this trade come from the moment the customer feels the number was fair after the truck leaves, not before it arrives.",
      "If you are comparing companies, ask what happens when the pile is bigger. Ask where the load goes. Ask who will actually stand in your garage. Those answers are worth more than a race to the lowest number on a search ad.",
    ],
    questions: [
      {
        q: "Do you charge extra for last-minute cancellation?",
        a: "If you cancel before the crew is en route, we release the window. Same-day cancellations after a technician is driving may include a trip fee. Your account page shows the status so you can cancel early when plans change.",
      },
      {
        q: "Is the estimate free?",
        a: "Yes. Photos, a call, or the schedule form will not generate a charge. You approve the work before we load.",
      },
    ],
  },
  {
    slug: "landlord-and-tenant-cleanouts",
    title: "Landlord and tenant cleanouts across Alameda and Contra Costa counties",
    excerpt:
      "How property managers clear units quickly, what tenants can schedule themselves, and how dispatch keeps both sides informed.",
    category: "Property",
    readMinutes: 6,
    paragraphs: [
      "Turnover weeks are a season of their own in the East Bay. A unit in Union City, a duplex in Richmond, or a house in Antioch can sit unrentable because the last household left a sofa, a broken bed, and a refrigerator that hums but will not close. We built our dispatch board with that week in mind.",
      "Landlords can book from the company dashboard, assign the job to a tech already in the city, and send the tenant or the on-site manager a status link. Tenants can also create their own account, schedule a haul before they hand over keys, and cancel if the roommate suddenly claims the dresser.",
      "The kindest cleanout is the one that happens before a lock change. When people have a day to collect mail and the last box, the job stays ordinary. When a unit has sat, we treat it as an estate-style walkthrough: keep nothing that is not labeled, document what we haul, and leave the floors ready for cleaners.",
      "Commercial and residential mix in this work. A small property firm may need five units in one Friday. We can stack those stops if they sit in the same county. That is the practical gift of a local crew that already knows the 580, 680, 80, and 24 corridors.",
      "Review requests after a clean turnover help honest companies. We send them only when a job is completed and only to the customer who booked. Nobody wants a text about a dumpster they did not order. The ops dashboard lets you choose email through Resend or SMS through your phone provider.",
    ],
    questions: [
      {
        q: "Can a property manager see every building’s jobs?",
        a: "The ops dashboard is built for that view. Customer accounts see only their own tickets.",
      },
      {
        q: "Do you haul trash bags left on a porch?",
        a: "Yes, as part of a scheduled visit. We do not do unattended curbside mystery piles without a booking and a contact on site.",
      },
    ],
  },
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
