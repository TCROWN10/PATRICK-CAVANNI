# Patrick Cavanni — Digital Invitation

Private digital invitation for **Patrick Cavanni: A New Chapter** (Tethered Lines), 7 November 2026, Stellar Inhouse, Lagos.

## Local development

```bash
npm install
npm run dev -- -p 3001
```

Open [http://localhost:3001](http://localhost:3001). Guest examples: see `GUEST-INVITES.md`.

## Guest links

- Full list: [`GUEST-INVITES.md`](./GUEST-INVITES.md)
- CSV (name, link, WhatsApp): [`data/guest-links.csv`](./data/guest-links.csv)
- Source data: [`data/guests.csv`](./data/guests.csv)

After you know your live Vercel URL:

```bash
npm run guests -- https://your-deployment.vercel.app
```

## Environment (optional)

Copy `.env.example` to `.env.local`:

- `NEXT_PUBLIC_SITE_URL` — live site URL (link previews / Wallet)
- Google Wallet vars — only if enabling “Add to Google Wallet”

## Deploy

Connect this repo to [Vercel](https://vercel.com). Set `NEXT_PUBLIC_SITE_URL` to the production domain, then regenerate guest links with that URL.
