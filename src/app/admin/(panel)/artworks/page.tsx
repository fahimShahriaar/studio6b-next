import Link from "next/link";
import { Pencil } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { deleteArtwork } from "./actions";

export const dynamic = "force-dynamic";

const availabilityVariant = {
  AVAILABLE: "default",
  SOLD: "secondary",
  RESERVED: "outline",
} as const;

export default async function ArtworksPage() {
  const artworks = await prisma.artwork.findMany({
    orderBy: { createdAt: "desc" },
    include: { artist: true, artType: true },
  });

  return (
    <div>
      <PageHeader
        title="Artworks"
        description="Manage the artwork catalog."
        actionLabel="New artwork"
        actionHref="/admin/artworks/new"
      />
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16"></TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Artist</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {artworks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No artworks yet.
                </TableCell>
              </TableRow>
            ) : (
              artworks.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={a.previewUrl ?? a.imageUrl}
                      alt={a.title}
                      className="size-10 rounded object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{a.title}</TableCell>
                  <TableCell className="font-mono text-xs">{a.code}</TableCell>
                  <TableCell>{a.artist.name}</TableCell>
                  <TableCell>{a.artType?.name ?? "—"}</TableCell>
                  <TableCell>
                    {a.priceVisible
                      ? formatPrice(a.price ? a.price.toString() : null, a.currency) ?? "—"
                      : "Hidden"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={availabilityVariant[a.availability]}>
                      {a.availability.charAt(0) +
                        a.availability.slice(1).toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" render={
                        <Link href={`/admin/artworks/${a.id}`} aria-label="Edit">
                          <Pencil className="size-4" />
                        </Link>
                      } />
                      <DeleteButton id={a.id} action={deleteArtwork} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
