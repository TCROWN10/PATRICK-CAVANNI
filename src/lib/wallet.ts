import { createSign, randomUUID } from "node:crypto";
import { invite } from "./invite";

const issuerId = process.env.GOOGLE_WALLET_ISSUER_ID;
const serviceAccountEmail = process.env.GOOGLE_WALLET_SERVICE_ACCOUNT_EMAIL;
// Env files usually store the PEM key on one line with literal "\n" sequences.
const privateKey = process.env.GOOGLE_WALLET_PRIVATE_KEY?.replace(/\\n/g, "\n");
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export function isWalletEnabled() {
  return Boolean(issuerId && serviceAccountEmail && privateKey);
}

const base64url = (input: string | Buffer) => Buffer.from(input).toString("base64url");
const text = (value: string) => ({ defaultValue: { language: "en-US", value } });

export function createSaveToWalletUrl(guest?: { code: string; name: string }) {
  if (!issuerId || !serviceAccountEmail || !privateKey) {
    throw new Error("Google Wallet is not configured");
  }

  const classId = `${issuerId}.patrick_cavanni_new_chapter_2026`;
  const objectSuffix = (guest?.code ?? randomUUID()).replace(/[^\w.-]/g, "_");
  const inviteLink = siteUrl ? `${siteUrl}${guest ? `/i/${guest.code}` : ""}` : undefined;

  const eventClass = {
    id: classId,
    issuerName: invite.brand,
    reviewStatus: "UNDER_REVIEW",
    eventName: text(`${invite.title}: ${invite.eventName}`),
    venue: { name: text(invite.venue), address: text(invite.venueAddress) },
    dateTime: { start: invite.startsAt, end: invite.endsAt },
    hexBackgroundColor: "#7b1e3a",
    ...(siteUrl && {
      logo: { sourceUri: { uri: `${siteUrl}/icon.png` } },
      heroImage: { sourceUri: { uri: `${siteUrl}${invite.ogImage}` } },
    }),
  };

  const eventObject = {
    id: `${issuerId}.${objectSuffix}`,
    classId,
    state: "ACTIVE",
    ...(guest && { ticketHolderName: guest.name }),
    ...(inviteLink && {
      barcode: { type: "QR_CODE", value: inviteLink, alternateText: "Show at the door" },
      linksModuleData: { uris: [{ uri: inviteLink, description: "Open invitation" }] },
    }),
  };

  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(
    JSON.stringify({
      iss: serviceAccountEmail,
      aud: "google",
      typ: "savetowallet",
      iat: Math.floor(Date.now() / 1000),
      origins: siteUrl ? [siteUrl] : [],
      payload: { eventTicketClasses: [eventClass], eventTicketObjects: [eventObject] },
    }),
  );
  const signature = createSign("RSA-SHA256").update(`${header}.${claims}`).sign(privateKey);

  return `https://pay.google.com/gp/v/save/${header}.${claims}.${base64url(signature)}`;
}
