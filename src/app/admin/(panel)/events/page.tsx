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
import { deleteEvent } from "./actions";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: [{ startDate: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <PageHeader
        title="Events"
        description="News and events shown on the What's On page."
        actionLabel="New event"
        actionHref="/admin/events/new"
      />
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>When</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No events yet.
                </TableCell>
              </TableRow>
            ) : (
              events.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.title}</TableCell>
                  <TableCell>
                    {formatDateRange(e.startDate, e.endDate) ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={e.published ? "default" : "secondary"}>
                      {e.published ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon-sm" render={
                        <Link href={`/admin/events/${e.id}`} aria-label="Edit">
                          <Pencil className="size-4" />
                        </Link>
                      } />
                      <DeleteButton id={e.id} action={deleteEvent} />
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
