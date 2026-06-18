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
import { formatDateRange } from "@/lib/utils";
import { deleteExhibition } from "./actions";

export const dynamic = "force-dynamic";

const statusVariant = {
  ONGOING: "default",
  UPCOMING: "secondary",
  PREVIOUS: "outline",
} as const;

export default async function ExhibitionsPage() {
  const exhibitions = await prisma.exhibition.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { artworks: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Exhibitions"
        description="Create and manage exhibitions and their artworks."
        actionLabel="New exhibition"
        actionHref="/admin/exhibitions/new"
      />
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Artworks</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exhibitions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No exhibitions yet.
                </TableCell>
              </TableRow>
            ) : (
              exhibitions.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.title}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[e.status]}>
                      {e.status.charAt(0) + e.status.slice(1).toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDateRange(e.startDate, e.endDate) ?? "—"}
                  </TableCell>
                  <TableCell>{e._count.artworks}</TableCell>
                  <TableCell>
                    {e.published ? (
                      <span className="text-sm text-muted-foreground">Public</span>
                    ) : (
                      <Badge variant="outline">Hidden</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" render={
                        <Link href={`/admin/exhibitions/${e.id}`} aria-label="Edit">
                          <Pencil className="size-4" />
                        </Link>
                      } />
                      <DeleteButton id={e.id} action={deleteExhibition} />
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
