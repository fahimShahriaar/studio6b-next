/**
 * Build a WhatsApp click-to-chat URL.
 *
 * Normalizes local Bangladesh numbers (e.g. "01325402965") to international
 * format ("8801325402965"). The message template supports {code}, {title},
 * {medium}, {artist} placeholders so the admin can customize it from Settings.
 */

export type WhatsAppVars = {
  code?: string | null;
  title?: string | null;
  medium?: string | null;
  artist?: string | null;
};

/** Convert a display number to the digits-only international form WhatsApp expects. */
export function normalizeWhatsAppNumber(raw: string): string {
  let digits = (raw || "").replace(/[^\d]/g, "");
  if (!digits) return digits;
  // Local BD format starting with leading 0 (e.g. 01325402965) -> 880...
  if (digits.startsWith("0")) {
    digits = "880" + digits.slice(1);
  }
  return digits;
}

export function applyTemplate(template: string, vars: WhatsAppVars): string {
  return template
    .replace(/\{code\}/g, vars.code ?? "")
    .replace(/\{title\}/g, vars.title ?? "")
    .replace(/\{medium\}/g, vars.medium ?? "")
    .replace(/\{artist\}/g, vars.artist ?? "");
}

export function buildWhatsAppUrl(
  number: string,
  template: string,
  vars: WhatsAppVars
): string {
  const phone = normalizeWhatsAppNumber(number);
  const text = applyTemplate(template, vars);
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
