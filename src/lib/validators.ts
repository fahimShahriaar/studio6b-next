import { z } from "zod";

/** Treat empty strings from form inputs as undefined. */
const emptyToUndefined = z
  .string()
  .transform((v) => (v.trim() === "" ? undefined : v))
  .optional();

const optionalUrl = emptyToUndefined;

export const AVAILABILITY = ["AVAILABLE", "SOLD", "RESERVED"] as const;
export const EXHIBITION_STATUS = ["ONGOING", "UPCOMING", "PREVIOUS"] as const;

export const artTypeSchema = z.object({
  name: z.string().min(1, "Name is required").max(60),
});
export type ArtTypeInput = z.infer<typeof artTypeSchema>;

export const artistSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  bio: emptyToUndefined,
  imageUrl: optionalUrl,
});
export type ArtistInput = z.infer<typeof artistSchema>;

export const artworkSchema = z.object({
  code: z.string().min(1, "Code is required").max(40),
  title: z.string().min(1, "Title is required").max(200),
  artistId: z.string().min(1, "Artist is required"),
  artTypeId: emptyToUndefined,
  imageUrl: z.string().min(1, "Main image is required"),
  previewUrl: optionalUrl,
  alt: emptyToUndefined,
  year: emptyToUndefined,
  medium: emptyToUndefined,
  dimensions: emptyToUndefined,
  description: emptyToUndefined,
  price: z
    .union([z.coerce.number().min(0), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : Number(v))),
  currency: z.string().default("BDT"),
  priceVisible: z.boolean().default(true),
  availability: z.enum(AVAILABILITY).default("AVAILABLE"),
  featured: z.boolean().default(false),
  galleryImages: z.array(z.string()).default([]),
});
export type ArtworkInput = z.infer<typeof artworkSchema>;

export const exhibitionSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  status: z.enum(EXHIBITION_STATUS).default("UPCOMING"),
  summary: emptyToUndefined,
  description: emptyToUndefined,
  heroImageUrl: optionalUrl,
  location: emptyToUndefined,
  startDate: emptyToUndefined,
  endDate: emptyToUndefined,
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  galleryImages: z.array(z.string()).default([]),
  artworkIds: z.array(z.string()).default([]),
});
export type ExhibitionInput = z.infer<typeof exhibitionSchema>;

export const collectionSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: emptyToUndefined,
  coverImageUrl: optionalUrl,
  featured: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
  artworkIds: z.array(z.string()).default([]),
});
export type CollectionInput = z.infer<typeof collectionSchema>;

export const carouselSchema = z.object({
  imageUrl: z.string().min(1, "Image is required"),
  headline: emptyToUndefined,
  subtext: emptyToUndefined,
  ctaLabel: emptyToUndefined,
  ctaHref: emptyToUndefined,
  sortOrder: z.coerce.number().int().default(0),
  active: z.boolean().default(true),
});
export type CarouselInput = z.infer<typeof carouselSchema>;

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  body: emptyToUndefined,
  imageUrl: optionalUrl,
  location: emptyToUndefined,
  startDate: emptyToUndefined,
  endDate: emptyToUndefined,
  published: z.boolean().default(true),
});
export type EventInput = z.infer<typeof eventSchema>;

export const settingsSchema = z.object({
  galleryName: z.string().min(1, "Gallery name is required"),
  tagline: emptyToUndefined,
  whatsappNumber: z.string().min(1, "WhatsApp number is required"),
  whatsappTemplate: z.string().min(1, "Message template is required"),
  contactEmail: emptyToUndefined,
  contactPhone: emptyToUndefined,
  address: emptyToUndefined,
  instagramUrl: optionalUrl,
  facebookUrl: optionalUrl,
  aboutText: emptyToUndefined,
});
export type SettingsInput = z.infer<typeof settingsSchema>;
