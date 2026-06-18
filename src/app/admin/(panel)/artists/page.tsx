import Link from "next/link";
import { Pencil } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { deleteArtist } from "./actions";

export const dynamic = "force-dynamic";

export default async function ArtistsPage() {
  const artists = await prisma.artist.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { artworks: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Artists"
        description="Manage artist profiles."
        actionLabel="New artist"
        actionHref="/admin/artists/new"
      />
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Artworks</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {artists.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No artists yet.
                </TableCell>
              </TableRow>
            ) : (
              artists.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    {a.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={a.imageUrl}
                        alt={a.name}
                        className="size-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="size-10 rounded-full bg-muted" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell>{a._count.artworks}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" render={
                        <Link href={`/admin/artists/${a.id}`} aria-label="Edit">
                          <Pencil className="size-4" />
                        </Link>
                      } />
                      <DeleteButton id={a.id} action={deleteArtist} />
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
