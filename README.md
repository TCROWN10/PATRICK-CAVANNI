# Patrick Cavanni — Digital Invitation

Private digital invitation for **Patrick Cavanni: A New Chapter** (Tethered Lines), 7 November 2026, Stellar Inhouse, Lagos.

## Local development

```bash
npm install
npm run dev -- -p 3001
```

Open [http://localhost:3001](http://localhost:3001). Guest examples: see `GUEST-INVITES.md`.

## Live site

[https://patrick-cavanni.vercel.app](https://patrick-cavanni.vercel.app)

## Guest links

- Full list: [`GUEST-INVITES.md`](./GUEST-INVITES.md)
- CSV (name, link, WhatsApp): [`data/guest-links.csv`](./data/guest-links.csv)
- Source data: [`data/guests.csv`](./data/guests.csv)

To regenerate links after a URL change:

```bash
npm run guests -- https://patrick-cavanni.vercel.app
```

## Environment (optional)

In Vercel → Project → Settings → Environment Variables, set:

- `NEXT_PUBLIC_SITE_URL` = `https://patrick-cavanni.vercel.app`

Google Wallet vars are optional (only if enabling “Add to Google Wallet”).
