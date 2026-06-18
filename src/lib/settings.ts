import { cache } from "react";
import { prisma } from "@/lib/prisma";

export type Settings = {
  galleryName: string;
  tagline: string | null;
  whatsappNumber: string;
  whatsappTemplate: string;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  aboutText: string | null;
};

const DEFAULTS: Settings = {
  galleryName: "Art Gallery",
  tagline: null,
  whatsappNumber: "01325402965",
  whatsappTemplate:
    "Hello, I would like to inquire about the {medium} artwork with the code: {code}.",
  contactEmail: null,
  contactPhone: null,
  address: null,
  instagramUrl: null,
  facebookUrl: null,
  aboutText: null,
};

/** Cached per-request fetch of the site settings singleton (with safe defaults). */
export const getSettings = cache(async (): Promise<Settings> => {
  const s = await prisma.siteSetting.findUnique({ where: { id: "singleton" } });
  return s ?? DEFAULTS;
});
