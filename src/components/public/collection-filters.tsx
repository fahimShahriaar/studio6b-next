"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { Option } from "@/components/admin/form-fields";

const ALL = "all";

export function CollectionFilters({
  artists,
  artTypes,
}: {
  artists: Option[];
  artTypes: Option[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [q, setQ] = useState(params.get("q") ?? "");
  const [min, setMin] = useState(params.get("min") ?? "");
  const [max, setMax] = useState(params.get("max") ?? "");

  function apply(updates: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === null || value === "" || value === ALL) next.delete(key);
      else next.set(key, value);
    }
    next.delete("page"); // reset to first page on any filter change
    router.push(`${pathname}?${next.toString()}`);
  }

  function clearAll() {
    setQ("");
    setMin("");
    setMax("");
    router.push(pathname);
  }

  const hasFilters =
    !!params.get("q") ||
    !!params.get("artist") ||
    !!params.get("type") ||
    !!params.get("min") ||
    !!params.get("max");

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          apply({ q });
        }}
      >
        <Label htmlFor="q" className="mb-2 block">
          Search
        </Label>
        <Input
          id="q"
          placeholder="Title, code or artist…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </form>

      <div>
        <Label className="mb-2 block">Artist</Label>
        <Select
          items={[{ value: ALL, label: "All artists" }, ...artists]}
          value={params.get("artist") ?? ALL}
          onValueChange={(v) => apply({ artist: v })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All artists" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All artists</SelectItem>
            {artists.map((a) => (
              <SelectItem key={a.value} value={a.value}>
                {a.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2 block">Art type</Label>
        <Select
          items={[{ value: ALL, label: "All types" }, ...artTypes]}
          value={params.get("type") ?? ALL}
          onValueChange={(v) => apply({ type: v })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All types</SelectItem>
            {artTypes.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          apply({ min, max });
        }}
      >
        <Label className="mb-2 block">Price range</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={min}
            onChange={(e) => setMin(e.target.value)}
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="number"
            placeholder="Max"
            value={max}
            onChange={(e) => setMax(e.target.value)}
          />
        </div>
        <Button type="submit" variant="outline" size="sm" className="mt-2 w-full">
          Apply price
        </Button>
      </form>

      {hasFilters ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className="w-full justify-center"
        >
          <X className="size-4" /> Clear filters
        </Button>
      ) : null}
    </div>
  );
}
