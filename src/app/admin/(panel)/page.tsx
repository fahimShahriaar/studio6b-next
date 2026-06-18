import Link from "next/link";
import {
  Frame,
  Image as ImageIcon,
  Users,
  FolderOpen,
  CalendarDays,
  Tags,
} from "lucide-react";

import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    artworks,
    exhibitions,
    artists,
    collections,
    artTypes,
    events,
    ongoing,
    available,
  ] = await Promise.all([
    prisma.artwork.count(),
    prisma.exhibition.count(),
    prisma.artist.count(),
    prisma.collection.count(),
    prisma.artType.count(),
    prisma.event.count(),
    prisma.exhibition.count({ where: { status: "ONGOING" } }),
    prisma.artwork.count({ where: { availability: "AVAILABLE" } }),
  ]);

  const stats = [
    { label: "Artworks", value: artworks, href: "/admin/artworks", icon: ImageIcon },
    { label: "Exhibitions", value: exhibitions, href: "/admin/exhibitions", icon: Frame },
    { label: "Artists", value: artists, href: "/admin/artists", icon: Users },
    { label: "Collections", value: collections, href: "/admin/collections", icon: FolderOpen },
    { label: "Art Types", value: artTypes, href: "/admin/art-types", icon: Tags },
    { label: "Events", value: events, href: "/admin/events", icon: CalendarDays },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">
          {ongoing} ongoing exhibition{ongoing === 1 ? "" : "s"} ·{" "}
          {available} artwork{available === 1 ? "" : "s"} available
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href}>
              <Card className="transition-colors hover:border-primary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {s.label}
                  </CardTitle>
                  <Icon className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-semibold">{s.value}</div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link
            href="/admin/artworks/new"
            className="text-sm font-medium text-primary hover:underline"
          >
            + New artwork
          </Link>
          <Link
            href="/admin/exhibitions/new"
            className="text-sm font-medium text-primary hover:underline"
          >
            + New exhibition
          </Link>
          <Link
            href="/admin/collections/new"
            className="text-sm font-medium text-primary hover:underline"
          >
            + New collection
          </Link>
          <Link
            href="/admin/settings"
            className="text-sm font-medium text-primary hover:underline"
          >
            Edit site settings
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
