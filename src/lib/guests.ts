import { readFileSync } from "node:fs";
import path from "node:path";
import { parseCsv } from "./csv.mjs";

export type Guest = {
  code: string;
  name: string;
  message: string;
};

export function getGuests(): Guest[] {
  const file = path.join(process.cwd(), "data", "guests.csv");
  return parseCsv(readFileSync(file, "utf8"))
    .filter((row) => row.code && row.name)
    .map((row) => ({ code: row.code, name: row.name, message: row.message ?? "" }));
}

export function getGuest(code: string): Guest | undefined {
  return getGuests().find((g) => g.code === code);
}
