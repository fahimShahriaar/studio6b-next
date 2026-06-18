"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Frame,
  Users,
  FolderOpen,
  Tags,
  GalleryHorizontal,
  CalendarDays,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/exhibitions", label: "Exhibitions", icon: Frame },
  { href: "/admin/artworks", label: "Artworks", icon: ImageIcon },
  { href: "/admin/artists", label: "Artists", icon: Users },
  { href: "/admin/collections", label: "Collections", icon: FolderOpen },
  { href: "/admin/art-types", label: "Art Types", icon: Tags },
  { href: "/admin/carousel", label: "Carousel", icon: GalleryHorizontal },
  { href: "/admin/events", label: "Events", icon: CalendarDays },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-1 p-3">
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname === link.href || pathname.startsWith(link.href + "/");
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
