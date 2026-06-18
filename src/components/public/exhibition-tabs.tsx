"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ExhibitionCard, type ExhibitionCardData } from "@/components/public/cards";

function Grid({ items }: { items: ExhibitionCardData[] }) {
  if (items.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        Nothing here right now. Check back soon.
      </p>
    );
  }
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {items.map((e) => (
        <ExhibitionCard key={e.slug} exhibition={e} />
      ))}
    </div>
  );
}

export function ExhibitionTabs({
  ongoing,
  upcoming,
  previous,
}: {
  ongoing: ExhibitionCardData[];
  upcoming: ExhibitionCardData[];
  previous: ExhibitionCardData[];
}) {
  const defaultTab =
    ongoing.length > 0 ? "ongoing" : upcoming.length > 0 ? "upcoming" : "previous";

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="mb-8">
        <TabsTrigger value="ongoing">Ongoing ({ongoing.length})</TabsTrigger>
        <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
        <TabsTrigger value="previous">Previous ({previous.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="ongoing">
        <Grid items={ongoing} />
      </TabsContent>
      <TabsContent value="upcoming">
        <Grid items={upcoming} />
      </TabsContent>
      <TabsContent value="previous">
        <Grid items={previous} />
      </TabsContent>
    </Tabs>
  );
}
