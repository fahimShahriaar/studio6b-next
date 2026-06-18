import Image from "next/image";
import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { ExhibitionCard, SectionHeading } from "@/components/public/cards";
import { formatDateRange } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "What's On",
  description: "Current and upcoming exhibitions and events.",
};

export default async function WhatsOnPage() {
  const [ongoing, upcoming, events] = await Promise.all([
    prisma.exhibition.findMany({
      where: { published: true, status: "ONGOING" },
      orderBy: { startDate: "asc" },
    }),
    prisma.exhibition.findMany({
      where: { published: true, status: "UPCOMING" },
      orderBy: { startDate: "asc" },
    }),
    prisma.event.findMany({
      where: { published: true },
      orderBy: { startDate: "asc" },
    }),
  ]);

  const nothing =
    ongoing.length === 0 && upcoming.length === 0 && events.length === 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-12">
        <h1 className="font-serif text-4xl font-semibold sm:text-5xl">
          What&apos;s On
        </h1>
        <p className="mt-2 text-muted-foreground">
          Current and upcoming exhibitions and events.
        </p>
      </header>

      {nothing ? (
        <p className="py-20 text-center text-muted-foreground">
          Nothing scheduled at the moment. Please check back soon.
        </p>
      ) : null}

      {ongoing.length > 0 ? (
        <section className="mb-16">
          <SectionHeading title="On Now" />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {ongoing.map((e) => (
              <ExhibitionCard key={e.slug} exhibition={e} />
            ))}
          </div>
        </section>
      ) : null}

      {upcoming.length > 0 ? (
        <section className="mb-16">
          <SectionHeading title="Upcoming" />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e) => (
              <ExhibitionCard key={e.slug} exhibition={e} />
            ))}
          </div>
        </section>
      ) : null}

      {events.length > 0 ? (
        <section>
          <SectionHeading title="Events" />
          <div className="space-y-4">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row"
              >
                {ev.imageUrl ? (
                  <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-md bg-muted sm:h-28 sm:w-44">
                    <Image
                      src={ev.imageUrl}
                      alt={ev.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 176px"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div>
                  <h3 className="font-serif text-lg font-semibold">{ev.title}</h3>
                  {formatDateRange(ev.startDate, ev.endDate) ? (
                    <p className="text-sm text-muted-foreground">
                      {formatDateRange(ev.startDate, ev.endDate)}
                      {ev.location ? ` · ${ev.location}` : ""}
                    </p>
                  ) : null}
                  {ev.body ? (
                    <p className="mt-2 text-sm text-muted-foreground">{ev.body}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
