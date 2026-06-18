import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Turn a string into a URL-friendly slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

/** Format a price (number | string | null) with currency for display. */
export function formatPrice(
  price: number | string | null | undefined,
  currency = "BDT"
): string | null {
  if (price === null || price === undefined || price === "") return null
  const value = typeof price === "string" ? Number(price) : price
  if (Number.isNaN(value)) return null
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value)
  } catch {
    return `${currency} ${value.toLocaleString()}`
  }
}

/** Human-readable date range for exhibitions/events. */
export function formatDateRange(
  start?: Date | string | null,
  end?: Date | string | null
): string | null {
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  const s = start ? new Date(start) : null
  const e = end ? new Date(end) : null
  if (s && e) return `${fmt(s)} – ${fmt(e)}`
  if (s) return fmt(s)
  if (e) return fmt(e)
  return null
}
