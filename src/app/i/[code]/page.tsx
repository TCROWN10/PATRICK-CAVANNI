import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Invitation } from "@/components/Invitation";
import { invite } from "@/lib/invite";
import { getGuest, getGuests } from "@/lib/guests";
import { isWalletEnabled } from "@/lib/wallet";

export const instant = false;

export function generateStaticParams() {
  return getGuests().map((g) => ({ code: g.code }));
}

export async function generateMetadata({
  params,
}: PageProps<"/i/[code]">): Promise<Metadata> {
  const guest = getGuest((await params).code);
  if (!guest) return {};
  const title = `${guest.name}, you're invited · ${invite.title}`;
  return {
    title,
    openGraph: { title },
    twitter: { title },
    robots: { index: false, follow: false },
  };
}

export default async function GuestInvitePage({
  params,
}: PageProps<"/i/[code]">) {
  const guest = getGuest((await params).code);
  if (!guest) notFound();
  return <Invitation guest={guest} walletEnabled={isWalletEnabled()} />;
}
