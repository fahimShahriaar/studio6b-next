import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const [exhibitions, artworks, artists, collections] = await Promise.all([
    prisma.exhibition.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
    prisma.artwork.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.artist.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.collection.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  const staticRoutes = ["", "/whats-on", "/exhibitions", "/collections"].map(
    (path) => ({ url: `${base}${path}`, lastModified: new Date() })
  );

  return [
    ...staticRoutes,
    ...exhibitions.map((e) => ({
      url: `${base}/exhibitions/${e.slug}`,
      lastModified: e.updatedAt,
    })),
    ...collections.map((c) => ({
      url: `${base}/collections/${c.slug}`,
      lastModified: c.updatedAt,
    })),
    ...artworks.map((a) => ({
      url: `${base}/artworks/${a.slug}`,
      lastModified: a.updatedAt,
    })),
    ...artists.map((a) => ({
      url: `${base}/artists/${a.slug}`,
      lastModified: a.updatedAt,
    })),
  ];
}
