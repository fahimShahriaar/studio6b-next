"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type PickerArtwork = {
  id: string;
  title: string;
  code: string;
  imageUrl: string;
  artistName: string;
};

/**
 * Multiselect list of artworks with thumbnails + search.
 * `value` is the ordered list of selected artwork ids.
 */
export function ArtworkPicker({
  artworks,
  value,
  onChange,
}: {
  artworks: PickerArtwork[];
  value: string[];
  onChange: (ids: string[]) => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return artworks;
    return artworks.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.code.toLowerCase().includes(q) ||
        a.artistName.toLowerCase().includes(q)
    );
  }, [artworks, query]);

  function toggle(id: string) {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search by title, code or artist…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-xs"
        />
        <span className="text-sm text-muted-foreground">
          {value.length} selected
        </span>
      </div>
      <div className="grid max-h-80 grid-cols-2 gap-2 overflow-y-auto rounded-md border p-2 sm:grid-cols-3">
        {filtered.length === 0 ? (
          <p className="col-span-full p-4 text-center text-sm text-muted-foreground">
            No artworks found.
          </p>
        ) : (
          filtered.map((a) => {
            const selected = value.includes(a.id);
            return (
              <button
                type="button"
                key={a.id}
                onClick={() => toggle(a.id)}
                className={cn(
                  "relative flex flex-col gap-1 rounded-md border p-1 text-left transition-colors",
                  selected
                    ? "border-primary ring-1 ring-primary"
                    : "hover:border-muted-foreground/40"
                )}
              >
                {selected ? (
                  <span className="absolute right-1 top-1 z-10 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3" />
                  </span>
                ) : null}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={a.imageUrl}
                  alt={a.title}
                  className="aspect-square w-full rounded object-cover"
                />
                <span className="truncate text-xs font-medium">{a.title}</span>
                <span className="truncate text-[11px] text-muted-foreground">
                  {a.code} · {a.artistName}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
