import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDateRange } from "@/lib/utils";

export type ArtworkCardData = {
  slug: string;
  title: string;
  imageUrl: string;
  previewUrl: string | null;
  alt: string | null;
  artistName: string;
  price: string | null;
  currency: string;
  priceVisible: boolean;
  availability: "AVAILABLE" | "SOLD" | "RESERVED";
};

export function ArtworkCard({ artwork }: { artwork: ArtworkCardData }) {
  const price = artwork.priceVisible
    ? formatPrice(artwork.price, artwork.currency)
    : null;

  return (
    <Link href={`/artworks/${artwork.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted">
        <Image
          src={artwork.previewUrl ?? artwork.imageUrl}
          alt={artwork.alt ?? artwork.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {artwork.availability !== "AVAILABLE" ? (
          <Badge
            variant="secondary"
            className="absolute left-2 top-2 capitalize"
          >
            {artwork.availability.toLowerCase()}
          </Badge>
        ) : null}
      </div>
      <div className="mt-3">
        <h3 className="font-medium leading-tight">{artwork.title}</h3>
        <p className="text-sm text-muted-foreground">{artwork.artistName}</p>
        {price ? <p className="mt-1 text-sm font-medium">{price}</p> : null}
      </div>
    </Link>
  );
}

export type ExhibitionCardData = {
  slug: string;
  title: string;
  heroImageUrl: string | null;
  summary: string | null;
  status: "ONGOING" | "UPCOMING" | "PREVIOUS";
  startDate: Date | null;
  endDate: Date | null;
};

const statusLabel = {
  ONGOING: "On Now",
  UPCOMING: "Upcoming",
  PREVIOUS: "Past",
} as const;

export function ExhibitionCard({
  exhibition,
}: {
  exhibition: ExhibitionCardData;
}) {
  const dates = formatDateRange(exhibition.startDate, exhibition.endDate);
  return (
    <Link href={`/exhibitions/${exhibition.slug}`} className="group block">
      <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
        {exhibition.heroImageUrl ? (
          <Image
            src={exhibition.heroImageUrl}
            alt={exhibition.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
        <Badge className="absolute left-3 top-3">
          {statusLabel[exhibition.status]}
        </Badge>
      </div>
      <div className="mt-3">
        <h3 className="font-serif text-lg font-semibold">{exhibition.title}</h3>
        {dates ? (
          <p className="text-sm text-muted-foreground">{dates}</p>
        ) : null}
        {exhibition.summary ? (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {exhibition.summary}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

export function SectionHeading({
  title,
  href,
  linkLabel = "View all",
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between">
      <h2 className="font-serif text-2xl font-semibold sm:text-3xl">{title}</h2>
      {href ? (
        <Link
          href={href}
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          {linkLabel} →
        </Link>
      ) : null}
    </div>
  );
}
