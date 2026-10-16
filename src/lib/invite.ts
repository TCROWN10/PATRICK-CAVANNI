type Photo = { src: string; alt: string };
type DressCodePhoto = { label: string; src: string };

export const invite = {
  brand: "Patrick Cavanni",
  logo: { src: "/brand/logo.png", width: 982, height: 1080 },
  crane: { src: "/brand/crane.png", width: 491, height: 1279 },
  ogImage: "/brand/og.jpg",
  heroes: [
    {
      src: "/Invitation-pic.jpeg",
      alt: "Model wearing a Patrick Cavanni purple woven cape over a lime green gown",
    },
    {
      src: "/Image-4.jpeg",
      alt: "Model in a burgundy pleated gown with a teal lattice cape and gold necklace",
    },
    {
      src: "/Image-5.jpeg",
      alt: "Model in a sculptural emerald green gown with architectural pleats",
    },
  ] as Photo[],

  title: "Patrick Cavanni",
  eventName: "A New Chapter",
  tagline: "Rooted in Africa. Created for the World.",
  greeting: "You have an INVITE!",
  openButton: "Open invitation",

  // Africa/Lagos is UTC+1 all year (no daylight saving).
  startsAt: "2026-11-07T12:00:00+01:00",
  endsAt: "2026-11-07T18:00:00+01:00",

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
    image: {
      src: "/Fashion-design-One.jpeg",
      width: 736,
      height: 981,
      alt: "A room woven with red threads, visitors walking through the installation",
    },
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
  gallery: [
    { src: "/Invitation-pic.jpeg", alt: "Model wearing a purple woven cape over a lime green gown" },
    { src: "/Image-4.jpeg", alt: "Model in a burgundy gown with a teal lattice cape" },
    { src: "/Image-5.jpeg", alt: "Model in a sculptural emerald green gown" },
    { src: "/Image-1.png", alt: "A glass cube woven with red thread, letter tiles suspended inside" },
    { src: "/Image-2.png", alt: "Two cocktail tables dressed in ivory linen with fresh flowers" },
    { src: "/Image-3.png", alt: "A guest in a tailored stone suit on a red carpet" },
    { src: "/Fashion-design-One.jpeg", alt: "A room woven with red threads, visitors walking through the installation" },
  ] as Photo[],

  venue: "Stellar Inhouse",
  venueAddress: "16 Kofo Abayomi Street, Victoria Island, Lagos",

  dressCodeTitle: "White, Gold & Burgundy",
  colors: [
    { name: "White", hex: "#ffffff" },
    { name: "Gold", hex: "#c9a24a" },
    { name: "Burgundy", hex: "#7b1e3a" },
  ],
  dressCode: [] as DressCodePhoto[],

  vision: "We honour where we come from. We create for where we are going.",
  signoff: "African Heritage. Timeless Elegance. Contemporary Excellence.",

  music: "/invite/unstoppable.mp3" as string | null,
};

export type Invite = typeof invite;
