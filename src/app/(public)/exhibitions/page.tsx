import Image from "next/image";
import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { ExhibitionTabs } from "@/components/public/exhibition-tabs";
import type { ExhibitionCardData } from "@/components/public/cards";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Exhibitions",
  description: "Ongoing, upcoming and previous exhibitions.",
};

function toCard(e: {
  slug: string;
  title: string;
  heroImageUrl: string | null;
  summary: string | null;
  status: "ONGOING" | "UPCOMING" | "PREVIOUS";
  startDate: Date | null;
  endDate: Date | null;
}): ExhibitionCardData {
  return e;
}

export default async function ExhibitionsPage() {
  const exhibitions = await prisma.exhibition.findMany({
    where: { published: true },
    orderBy: [{ startDate: "desc" }],
  });

  const ongoing = exhibitions.filter((e) => e.status === "ONGOING").map(toCard);
  const upcoming = exhibitions
    .filter((e) => e.status === "UPCOMING")
    .sort((a, b) => (a.startDate?.getTime() ?? 0) - (b.startDate?.getTime() ?? 0))
    .map(toCard);
  const previous = exhibitions.filter((e) => e.status === "PREVIOUS").map(toCard);

  const heroImage =
    ongoing[0]?.heroImageUrl ??
    upcoming[0]?.heroImageUrl ??
    previous[0]?.heroImageUrl ??
    null;

  return (
    <div>
      <section className="relative flex h-64 items-center justify-center overflow-hidden bg-neutral-900 sm:h-80">
        {heroImage ? (
          <Image
            src={heroImage}
            alt="Exhibitions"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-60"
          />
        ) : null}
        <div className="relative z-10 text-center text-white">
          <h1 className="font-serif text-4xl font-semibold drop-shadow sm:text-5xl">
            Exhibitions
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <ExhibitionTabs
          ongoing={ongoing}
          upcoming={upcoming}
          previous={previous}
        />
      </div>
    </div>
  );
}
