// Usage: npm run guests -- https://your-site.com
// Gives every guest without a code a private one, then writes data/guest-links.csv.
import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseCsv, toCsv } from "../src/lib/csv.mjs";

const root = process.cwd();
const guestsFile = path.join(root, "data", "guests.csv");
const linksFile = path.join(root, "data", "guest-links.csv");
const baseUrl = (process.argv[2] ?? "http://localhost:3001").replace(/\/$/, "");

const guests = parseCsv(readFileSync(guestsFile, "utf8"));
const used = new Set(guests.map((g) => g.code).filter(Boolean));

const newCode = () => {
  let code;
  do {
    code = randomBytes(5).toString("base64url").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 6);
  } while (code.length < 6 || used.has(code));
  used.add(code);
  return code;
};

let added = 0;
for (const g of guests) {
  if (!g.code) {
    g.code = newCode();
    added++;
  }
}

const missingNames = guests.filter((g) => !g.name);
if (missingNames.length) {
  console.warn(`Warning: ${missingNames.length} row(s) have no name and will not get a page.`);
}

writeFileSync(guestsFile, toCsv(guests, ["code", "name", "message"]));

const links = guests
  .filter((g) => g.name)
  .map((g) => {
    const link = `${baseUrl}/i/${g.code}`;
    const text = `Dear ${g.name}, you are invited to Patrick Cavanni: A New Chapter.\n${link}`;
    return {
      name: g.name,
      link,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
    };
  });

writeFileSync(linksFile, toCsv(links, ["name", "link", "whatsapp"]));

console.log(`${guests.length} guests, ${added} new code(s) created.`);
console.log(`Links written to data/guest-links.csv`);
