import Link from "next/link";
import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { ArtworkCard } from "@/components/public/cards";
import { CollectionFilters } from "@/components/public/collection-filters";
import { getArtistOptions, getArtTypeOptions } from "@/lib/options";
import { toArtworkCard } from "@/lib/mappers";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Collections",
  description: "Browse and filter available artworks.",
};

const PAGE_SIZE = 12;

type SearchParams = Promise<{
  q?: string;
  artist?: string;
  type?: string;
  min?: string;
  max?: string;
  page?: string;
}>;

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim();
  const artist = sp.artist;
  const type = sp.type;
  const min = sp.min ? Number(sp.min) : undefined;
  const max = sp.max ? Number(sp.max) : undefined;
  const page = Math.max(1, Number(sp.page) || 1);

  const where: Prisma.ArtworkWhereInput = {};
  if (artist) where.artistId = artist;
  if (type) where.artTypeId = type;
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { code: { contains: q, mode: "insensitive" } },
      { artist: { name: { contains: q, mode: "insensitive" } } },
    ];
  }
  if (min !== undefined || max !== undefined) {
    where.price = {};
    if (min !== undefined && !Number.isNaN(min)) where.price.gte = min;
    if (max !== undefined && !Number.isNaN(max)) where.price.lte = max;
  }

  const [total, artworks, artists, artTypes] = await Promise.all([
    prisma.artwork.count({ where }),
    prisma.artwork.findMany({
      where,
      include: { artist: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    getArtistOptions(),
    getArtTypeOptions(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function pageHref(p: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (artist) params.set("artist", artist);
    if (type) params.set("type", type);
    if (sp.min) params.set("min", sp.min);
    if (sp.max) params.set("max", sp.max);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/collections?${qs}` : "/collections";
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="font-serif text-4xl font-semibold">Collections</h1>
        <p className="mt-2 text-muted-foreground">
          {total} artwork{total === 1 ? "" : "s"}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <CollectionFilters artists={artists} artTypes={artTypes} />
        </aside>

        <div>
          {artworks.length === 0 ? (
            <div className="rounded-lg border border-dashed py-20 text-center text-muted-foreground">
              No artworks match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              {artworks.map((a) => (
                <ArtworkCard key={a.slug} artwork={toArtworkCard(a)} />
              ))}
            </div>
          )}

          {totalPages > 1 ? (
            <div className="mt-10 flex items-center justify-center gap-2">
              <Link
                href={pageHref(page - 1)}
                aria-disabled={page <= 1}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  page <= 1 && "pointer-events-none opacity-50"
                )}
              >
                Previous
              </Link>
              <span className="px-3 text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Link
                href={pageHref(page + 1)}
                aria-disabled={page >= totalPages}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  page >= totalPages && "pointer-events-none opacity-50"
                )}
              >
                Next
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
