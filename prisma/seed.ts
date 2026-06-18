import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const img = (seed: string, w = 900, h = 1100) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;
const wide = (seed: string) => `https://picsum.photos/seed/${seed}/1600/900`;

async function main() {
  console.log("🌱 Seeding database...");

  // ---- Admin user ----
  const email = process.env.ADMIN_EMAIL ?? "admin@artgallery.test";
  const password = process.env.ADMIN_PASSWORD ?? "Admin123!";
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name: process.env.ADMIN_NAME ?? "Gallery Admin" },
    create: {
      email,
      passwordHash,
      name: process.env.ADMIN_NAME ?? "Gallery Admin",
    },
  });
  console.log(`   ✓ Admin user: ${email}`);

  // ---- Site settings ----
  await prisma.siteSetting.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      galleryName: "Studio 6B Gallery",
      tagline: "Contemporary art from Bangladesh and beyond",
      whatsappNumber: "01325402965",
      whatsappTemplate:
        "Hello, I would like to inquire about the {medium} artwork with the code: {code}.",
      contactEmail: "hello@studio6b.gallery",
      contactPhone: "+880 1325 402965",
      address: "House 6B, Road 11, Banani, Dhaka 1213, Bangladesh",
      instagramUrl: "https://instagram.com",
      facebookUrl: "https://facebook.com",
      aboutText:
        "Studio 6B is a contemporary art gallery showcasing painting, drawing, sculpture and new media by established and emerging artists.",
    },
  });
  console.log("   ✓ Site settings");

  // ---- Art types ----
  const typeNames = [
    "Painting",
    "Drawing",
    "Sculpture",
    "Photography",
    "Mixed Media",
    "Print",
  ];
  const types: Record<string, string> = {};
  for (const name of typeNames) {
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const t = await prisma.artType.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });
    types[name] = t.id;
  }
  console.log(`   ✓ ${typeNames.length} art types`);

  // ---- Artists ----
  const artistData = [
    {
      slug: "abdus-sattar-toufiq",
      name: "Abdus Sattar Toufiq",
      bio: "Abdus Sattar Toufiq is a Dhaka-based painter known for evocative, melody-like compositions in acrylic. His work explores memory, music and the rhythms of everyday life.",
      imageUrl: img("artist-toufiq", 600, 600),
    },
    {
      slug: "rokeya-sultana",
      name: "Rokeya Sultana",
      bio: "Rokeya Sultana is a printmaker and painter whose layered imagery draws on motherhood, mythology and the female form.",
      imageUrl: img("artist-rokeya", 600, 600),
    },
    {
      slug: "mohammad-iqbal",
      name: "Mohammad Iqbal",
      bio: "Mohammad Iqbal works across sculpture and mixed media, transforming found materials into meditations on urban change.",
      imageUrl: img("artist-iqbal", 600, 600),
    },
    {
      slug: "nadia-rahman",
      name: "Nadia Rahman",
      bio: "Nadia Rahman is a contemporary photographer documenting the landscapes and people of the Bengal delta.",
      imageUrl: img("artist-nadia", 600, 600),
    },
  ];
  const artists: Record<string, string> = {};
  for (const a of artistData) {
    const created = await prisma.artist.upsert({
      where: { slug: a.slug },
      update: { name: a.name, bio: a.bio, imageUrl: a.imageUrl },
      create: a,
    });
    artists[a.slug] = created.id;
  }
  console.log(`   ✓ ${artistData.length} artists`);

  // ---- Artworks ----
  const artworkData = [
    {
      code: "M320",
      title: "The Lost Melody",
      artist: "abdus-sattar-toufiq",
      type: "Drawing",
      year: "2025",
      medium: "Acrylic on canvas",
      dimensions: '30" x 36"',
      price: 85000,
      description:
        "A quiet meditation on sound and silence, The Lost Melody layers warm ochres against deep shadow to evoke a half-remembered tune.",
      seed: "lost-melody",
      featured: true,
    },
    {
      code: "M211",
      title: "Morning Raga",
      artist: "abdus-sattar-toufiq",
      type: "Painting",
      year: "2024",
      medium: "Acrylic on canvas",
      dimensions: '24" x 30"',
      price: 72000,
      description:
        "Bright dawn tones break across the canvas in a celebration of the first light of day.",
      seed: "morning-raga",
      featured: true,
    },
    {
      code: "P104",
      title: "Mother and Child",
      artist: "rokeya-sultana",
      type: "Print",
      year: "2023",
      medium: "Etching on paper",
      dimensions: '18" x 24"',
      price: 45000,
      description:
        "An intimate etching exploring the bond between mother and child through delicate line work.",
      seed: "mother-child",
      featured: true,
    },
    {
      code: "P118",
      title: "Madonna in Blue",
      artist: "rokeya-sultana",
      type: "Painting",
      year: "2024",
      medium: "Mixed media on canvas",
      dimensions: '36" x 48"',
      price: 120000,
      description:
        "Layered indigo washes frame a contemplative figure in this large-format work.",
      seed: "madonna-blue",
      availability: "RESERVED" as const,
    },
    {
      code: "S045",
      title: "Urban Fossil",
      artist: "mohammad-iqbal",
      type: "Sculpture",
      year: "2022",
      medium: "Welded steel and concrete",
      dimensions: '40" x 20" x 20"',
      price: 210000,
      description:
        "Discarded city materials are fused into a monument to the impermanence of the urban landscape.",
      seed: "urban-fossil",
      featured: true,
    },
    {
      code: "S061",
      title: "Remnant II",
      artist: "mohammad-iqbal",
      type: "Mixed Media",
      year: "2023",
      medium: "Found objects and resin",
      dimensions: '24" x 18" x 12"',
      price: 95000,
      description:
        "The second in the Remnant series, suspending fragments of the everyday in clear resin.",
      seed: "remnant-2",
    },
    {
      code: "PH077",
      title: "Delta Light",
      artist: "nadia-rahman",
      type: "Photography",
      year: "2024",
      medium: "Archival pigment print",
      dimensions: '20" x 30"',
      price: 38000,
      description:
        "Soft morning light spills across the rivers of the Bengal delta in this serene landscape.",
      seed: "delta-light",
    },
    {
      code: "PH082",
      title: "The Boatman",
      artist: "nadia-rahman",
      type: "Photography",
      year: "2023",
      medium: "Archival pigment print",
      dimensions: '24" x 36"',
      price: 42000,
      description:
        "A lone boatman cuts across still water at dusk, a study in solitude and labor.",
      seed: "the-boatman",
      availability: "SOLD" as const,
    },
    {
      code: "M330",
      title: "Nocturne",
      artist: "abdus-sattar-toufiq",
      type: "Painting",
      year: "2025",
      medium: "Acrylic on canvas",
      dimensions: '30" x 40"',
      price: 98000,
      description:
        "Deep blues and silver highlights compose a hushed nighttime reverie.",
      seed: "nocturne",
    },
    {
      code: "D012",
      title: "Study of Hands",
      artist: "rokeya-sultana",
      type: "Drawing",
      year: "2022",
      medium: "Charcoal on paper",
      dimensions: '16" x 20"',
      price: 28000,
      description:
        "A tender charcoal study capturing the expressive language of the human hand.",
      seed: "study-hands",
    },
  ];

  const artworkIds: Record<string, string> = {};
  for (const a of artworkData) {
    const slug = a.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const created = await prisma.artwork.upsert({
      where: { code: a.code },
      update: {},
      create: {
        code: a.code,
        slug,
        title: a.title,
        imageUrl: img(a.seed),
        previewUrl: img(a.seed, 450, 550),
        alt: `${a.title} by ${artistData.find((x) => x.slug === a.artist)?.name}`,
        year: a.year,
        medium: a.medium,
        dimensions: a.dimensions,
        description: a.description,
        price: a.price,
        currency: "BDT",
        availability: a.availability ?? "AVAILABLE",
        featured: a.featured ?? false,
        artistId: artists[a.artist],
        artTypeId: types[a.type],
        images: {
          create: [
            { url: wide(`${a.seed}-1`), alt: `${a.title} detail 1`, sortOrder: 0 },
            { url: wide(`${a.seed}-2`), alt: `${a.title} detail 2`, sortOrder: 1 },
          ],
        },
      },
    });
    artworkIds[a.code] = created.id;
  }
  console.log(`   ✓ ${artworkData.length} artworks`);

  // ---- Exhibitions ----
  const exhibitions = [
    {
      slug: "echoes-of-melody",
      title: "Echoes of Melody",
      status: "ONGOING" as const,
      summary: "New acrylic works by Abdus Sattar Toufiq.",
      location: "Main Gallery, Studio 6B",
      start: new Date("2026-05-01"),
      end: new Date("2026-07-15"),
      featured: true,
      seed: "exh-echoes",
      artworks: ["M320", "M211", "M330"],
    },
    {
      slug: "lines-and-form",
      title: "Lines & Form",
      status: "UPCOMING" as const,
      summary: "A group drawing and print exhibition.",
      location: "East Wing, Studio 6B",
      start: new Date("2026-08-01"),
      end: new Date("2026-09-30"),
      featured: true,
      seed: "exh-lines",
      artworks: ["D012", "P104", "P118"],
    },
    {
      slug: "material-memory",
      title: "Material Memory",
      status: "UPCOMING" as const,
      summary: "Sculpture and mixed media by Mohammad Iqbal.",
      location: "Sculpture Court, Studio 6B",
      start: new Date("2026-10-10"),
      end: new Date("2026-11-20"),
      seed: "exh-material",
      artworks: ["S045", "S061"],
    },
    {
      slug: "delta-light-photography",
      title: "Delta Light",
      status: "PREVIOUS" as const,
      summary: "Photography of the Bengal delta by Nadia Rahman.",
      location: "Main Gallery, Studio 6B",
      start: new Date("2025-11-01"),
      end: new Date("2025-12-15"),
      seed: "exh-delta",
      artworks: ["PH077", "PH082"],
    },
    {
      slug: "first-light-2025",
      title: "First Light",
      status: "PREVIOUS" as const,
      summary: "Our inaugural group show.",
      location: "Studio 6B",
      start: new Date("2025-06-01"),
      end: new Date("2025-08-01"),
      seed: "exh-first",
      artworks: ["M211", "S045", "PH077"],
    },
  ];

  for (const e of exhibitions) {
    await prisma.exhibition.upsert({
      where: { slug: e.slug },
      update: {},
      create: {
        slug: e.slug,
        title: e.title,
        status: e.status,
        summary: e.summary,
        description: `${e.summary} ${"This exhibition brings together a curated selection of works that reward close looking, presented across our gallery spaces."}`,
        heroImageUrl: wide(e.seed),
        location: e.location,
        startDate: e.start,
        endDate: e.end,
        featured: e.featured ?? false,
        published: true,
        images: {
          create: [
            { url: wide(`${e.seed}-a`), sortOrder: 0 },
            { url: wide(`${e.seed}-b`), sortOrder: 1 },
            { url: wide(`${e.seed}-c`), sortOrder: 2 },
          ],
        },
        artworks: {
          create: e.artworks.map((code, i) => ({
            artworkId: artworkIds[code],
            sortOrder: i,
          })),
        },
      },
    });
  }
  console.log(`   ✓ ${exhibitions.length} exhibitions`);

  // ---- Collections ----
  const collections = [
    {
      slug: "signature-works",
      title: "Signature Works",
      description: "Standout pieces hand-picked by our curators.",
      featured: true,
      seed: "col-signature",
      artworks: ["M320", "S045", "P104", "M211"],
    },
    {
      slug: "works-on-paper",
      title: "Works on Paper",
      description: "Drawings, prints and photography.",
      featured: true,
      seed: "col-paper",
      artworks: ["D012", "P104", "PH077", "PH082"],
    },
    {
      slug: "under-50k",
      title: "Collecting Under ৳50,000",
      description: "An accessible entry point for new collectors.",
      seed: "col-affordable",
      artworks: ["P104", "PH077", "PH082", "D012"],
    },
  ];

  for (const c of collections) {
    await prisma.collection.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        slug: c.slug,
        title: c.title,
        description: c.description,
        coverImageUrl: wide(c.seed),
        featured: c.featured ?? false,
        artworks: {
          create: c.artworks.map((code, i) => ({
            artworkId: artworkIds[code],
            sortOrder: i,
          })),
        },
      },
    });
  }
  console.log(`   ✓ ${collections.length} collections`);

  // ---- Carousel slides ----
  const existingSlides = await prisma.carouselSlide.count();
  if (existingSlides === 0) {
    await prisma.carouselSlide.createMany({
      data: [
        {
          imageUrl: wide("hero-1"),
          headline: "Echoes of Melody",
          subtext: "New acrylic works by Abdus Sattar Toufiq — on now.",
          ctaLabel: "View Exhibition",
          ctaHref: "/exhibitions/echoes-of-melody",
          sortOrder: 0,
        },
        {
          imageUrl: wide("hero-2"),
          headline: "Discover the Collection",
          subtext: "Browse available works across painting, drawing and sculpture.",
          ctaLabel: "Explore Collections",
          ctaHref: "/collections",
          sortOrder: 1,
        },
        {
          imageUrl: wide("hero-3"),
          headline: "Lines & Form",
          subtext: "A group drawing and print exhibition — opening August 2026.",
          ctaLabel: "What's On",
          ctaHref: "/whats-on",
          sortOrder: 2,
        },
      ],
    });
  }
  console.log("   ✓ Carousel slides");

  // ---- Events (What's On) ----
  const events = [
    {
      slug: "opening-reception-echoes",
      title: "Opening Reception: Echoes of Melody",
      body: "Join us for an evening with the artist. Refreshments served.",
      location: "Main Gallery, Studio 6B",
      start: new Date("2026-06-20T18:00:00"),
      seed: "event-opening",
    },
    {
      slug: "curator-walkthrough",
      title: "Curator's Walkthrough",
      body: "A guided tour of the current exhibition led by our chief curator.",
      location: "Studio 6B",
      start: new Date("2026-06-28T16:00:00"),
      seed: "event-walkthrough",
    },
  ];
  for (const ev of events) {
    await prisma.event.upsert({
      where: { slug: ev.slug },
      update: {},
      create: {
        slug: ev.slug,
        title: ev.title,
        body: ev.body,
        location: ev.location,
        startDate: ev.start,
        imageUrl: wide(ev.seed),
        published: true,
      },
    });
  }
  console.log(`   ✓ ${events.length} events`);

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
