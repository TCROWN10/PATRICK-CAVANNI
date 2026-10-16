type Photo = { src: string; alt: string };
type DressCodePhoto = { label: string; src: string };

export const invite = {
  brand: "Patrick Cavanni",
  logo: { src: "/brand/logo.png", width: 982, height: 1080 },
  crane: { src: "/brand/crane.png", width: 491, height: 1279 },
  ogImage: "/brand/og.jpg",
  heroes: [
    {
      src: "/Final-image.jpeg",
      alt: "Model in a burgundy pleated gown with teal woven structures — Tethered Lines",
    },
  ] as Photo[],

  title: "Patrick Cavanni",
  eventName: "A New Chapter",
  tagline: "Rooted in Africa. Created for the World.",
  greeting: "You have an INVITE!",
  openButton: "Open invitation",

  // Africa/Lagos is UTC+1 all year (no daylight saving).
  startsAt: "2026-11-07T18:00:00+01:00",
  endsAt: "2026-11-07T22:00:00+01:00",

  countdownTitle: "COUNTDOWN",

  house: {
    title: "THE HOUSE",
    body: [
      "Patrick Cavanni is a contemporary African luxury fashion house exploring the intersection of heritage, craftsmanship and modern identity.",
      "We create beyond trends. We create from meaning, memory and the enduring beauty of our cultural inheritance.",
    ],
    chapterTitle: "A New Chapter. A Return to Our Roots.",
    chapter:
      "Our rebranding is a renewed sense of purpose: turning towards the richness of African heritage to shape a distinctive expression of contemporary luxury.",
  },

  tetheredLines: {
    title: "Tethered Lines",
    subtitle: "The Architecture of the Mind",
    body: [
      "Tethered Lines explores the invisible connections that shape us: memory, heritage, relationships, ambitions and dreams.",
      "Through contemporary African craftsmanship, layered forms and intricate textures, it reflects how we inherit, transform and carry what makes us who we are.",
    ],
    quote: "We are made of connections. We carry what shaped us. We transform it. We build from it.",
  },

  crownedCrane: {
    title: "The Crowned Crane",
    subtitle: "Our Emblem. Our Philosophy.",
    body: [
      "The black-crowned crane stands at the heart of our identity. Its golden crown and graceful bearing embody nobility, dignity and quiet distinction.",
      "Once widespread across northern Nigeria’s wetlands, it is now considered possibly extinct there. We carry it as a reminder that heritage includes the natural world we inherit, and our responsibility to protect it.",
    ],
    quote: "What we honour, we must also protect.",
  },

  galleryTitle: "The Gallery",
  gallery: [] as Photo[],

  venue: "Stellar Inhouse",
  venueAddress: "16 Kofo Abayomi Street, Victoria Island, Lagos",

  dressCodeTitle: "White, Gold & Burgundy",
  colors: [
    { name: "White", hex: "#ffffff" },
    { name: "Gold", hex: "#c9a24a" },
    { name: "Burgundy", hex: "#7b1e3a" },
  ],
  dressCode: [] as DressCodePhoto[],
  showDressCode: false,

  vision: "We honour where we come from. We create for where we are going.",
  signoff: "African Heritage. Timeless Elegance. Contemporary Excellence.",

  music: "/invite/instrumental.mp3" as string | null,
};

export type Invite = typeof invite;
