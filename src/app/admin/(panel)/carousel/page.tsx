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
import { deleteSlide } from "./actions";

export const dynamic = "force-dynamic";

export default async function CarouselPage() {
  const slides = await prisma.carouselSlide.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Homepage Carousel"
        description="Hero slides shown at the top of the home page."
        actionLabel="New slide"
        actionHref="/admin/carousel/new"
      />
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24"></TableHead>
              <TableHead>Headline</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slides.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No slides yet.
                </TableCell>
              </TableRow>
            ) : (
              slides.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.imageUrl}
                      alt={s.headline ?? "Slide"}
                      className="h-12 w-20 rounded object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {s.headline ?? "—"}
                  </TableCell>
                  <TableCell>{s.sortOrder}</TableCell>
                  <TableCell>
                    <Badge variant={s.active ? "default" : "secondary"}>
                      {s.active ? "Active" : "Hidden"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" render={
                        <Link href={`/admin/carousel/${s.id}`} aria-label="Edit">
                          <Pencil className="size-4" />
                        </Link>
                      } />
                      <DeleteButton id={s.id} action={deleteSlide} />
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
