import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { getSettings } from "@/lib/settings";

export async function Footer() {
  const s = await getSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <h3 className="font-serif text-lg font-semibold">{s.galleryName}</h3>
          {s.tagline ? (
            <p className="mt-2 text-sm text-muted-foreground">{s.tagline}</p>
          ) : null}
          <div className="mt-4 flex gap-4 text-sm">
            {s.instagramUrl ? (
              <a
                href={s.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                Instagram
              </a>
            ) : null}
            {s.facebookUrl ? (
              <a
                href={s.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                Facebook
              </a>
            ) : null}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/whats-on" className="hover:text-foreground">What&apos;s On</Link></li>
            <li><Link href="/exhibitions" className="hover:text-foreground">Exhibitions</Link></li>
            <li><Link href="/collections" className="hover:text-foreground">Collections</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {s.address ? (
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                <span>{s.address}</span>
              </li>
            ) : null}
            {s.contactPhone ? (
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" />
                <a href={`tel:${s.contactPhone}`} className="hover:text-foreground">
                  {s.contactPhone}
                </a>
              </li>
            ) : null}
            {s.contactEmail ? (
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" />
                <a href={`mailto:${s.contactEmail}`} className="hover:text-foreground">
                  {s.contactEmail}
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>
      <div className="border-t py-6 text-center text-xs text-muted-foreground">
        © {year} {s.galleryName}. All rights reserved.
      </div>
    </footer>
  );
}
