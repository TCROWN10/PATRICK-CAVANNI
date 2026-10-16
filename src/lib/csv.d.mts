export function parseCsv(text: string): Record<string, string>[];
export function toCsv(rows: Record<string, unknown>[], columns: string[]): string;
