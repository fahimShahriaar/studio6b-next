import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/page-header";
import { SettingsForm } from "./settings-form";
import type { SettingsInput } from "@/lib/validators";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const s = await prisma.siteSetting.findUnique({ where: { id: "singleton" } });

  const initial: SettingsInput = {
    galleryName: s?.galleryName ?? "Art Gallery",
    tagline: s?.tagline ?? "",
    whatsappNumber: s?.whatsappNumber ?? "01325402965",
    whatsappTemplate:
      s?.whatsappTemplate ??
      "Hello, I would like to inquire about the {medium} artwork with the code: {code}.",
    contactEmail: s?.contactEmail ?? "",
    contactPhone: s?.contactPhone ?? "",
    address: s?.address ?? "",
    instagramUrl: s?.instagramUrl ?? "",
    facebookUrl: s?.facebookUrl ?? "",
    aboutText: s?.aboutText ?? "",
  };

  return (
    <div>
      <PageHeader
        title="Site Settings"
        description="Branding, WhatsApp inquiry, and contact details."
      />
      <SettingsForm initial={initial} />
    </div>
  );
}
