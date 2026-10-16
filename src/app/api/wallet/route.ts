import { connection } from "next/server";
import { getGuest } from "@/lib/guests";
import { createSaveToWalletUrl, isWalletEnabled } from "@/lib/wallet";

export async function GET(request: Request) {
  await connection();
  if (!isWalletEnabled()) {
    return new Response("Google Wallet is not configured", { status: 404 });
  }
  const code = new URL(request.url).searchParams.get("code");
  const guest = code ? getGuest(code) : undefined;
  return Response.redirect(createSaveToWalletUrl(guest), 302);
}
