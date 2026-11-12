import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"
import type {Book} from "@/types/main.ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



type HttpMethod = "GET" | "HEAD" | "POST" | "PUT" | "DELETE";

export async function fetchData(
    url: string,
    method: HttpMethod = "GET",
    body?: unknown
): Promise<Response> {
    return await fetch(url, {
      method,
      headers: body !== undefined ? {"Content-Type": "application/json"} : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

const ROMAN_MAP: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

export function toRoman(num: number): string {
  if (!Number.isInteger(num) || num < 1 || num > 3999) return "";

  let result = "";
  for (const [value, symbol] of ROMAN_MAP) {
    while (num >= value) {
      result += symbol;
      num -= value;
    }
  }
  return result;
}

export function fromNumericToRoman(bookName: string) : string  {

        const splitString = bookName.split(" ");
        // check that the book name is numbered
        if (splitString.length == 2) {
            // convert the decimal to roman numeral
            // console.log(splitString)
            const romanNumber = toRoman(Number(splitString[0]))
            bookName = `${romanNumber} ${splitString[1]}`
        }
        if (bookName === "Revelation") {
            bookName = "Revelation of John"
        }
        return bookName;
}





export type BibleReference = {
    book: Book;
    chapter: number;
    verse?: number;
};

export type BibleSuggestion = {
    label: string;
    value: string;
    type: "BOOK" | "CHAPTER" | "VERSE";
};

export type ParsedReference = {
    valid: boolean;
    reference?: BibleReference;
    error?: string;
};

/**
 * Optional lookups. Your Book type has no chapter/verse data, so supply these
 * if you want chapter/verse suggestions and range validation.
 */
export type ScriptureCounts = {
    chapterCount?: (bookId: number) => number | undefined;
    verseCount?: (bookId: number, chapter: number) => number | undefined;
};

// ---------- Helpers ----------

// "1.Cor", " 1  John " and "1john" all become "1 cor" / "1 john"
export const normalize = (value: string) =>
    value
        .toLowerCase()
        .replace(/[.]/g, "")
        .replace(/^(\d)(?=[a-z])/, "$1 ")
        .replace(/\s+/g, " ")
        .trim();

function levenshtein(a: string, b: string): number {
    const m = Array.from({ length: a.length + 1 }, (_, i) => [
        i,
        ...Array(b.length).fill(0),
    ]);
    for (let j = 0; j <= b.length; j++) m[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            m[i][j] = Math.min(
                m[i - 1][j] + 1,
                m[i][j - 1] + 1,
                m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
            );
        }
    }
    return m[a.length][b.length];
}

type IndexedBook = { book: Book; key: string };

const indexBooks = (books: Book[]): IndexedBook[] =>
    books.map(book => ({ book, key: normalize(book.name) }));

// ---------- Book matching ----------

type BookMatch = { book: Book; rank: number; distance: number };
// rank: 0 = exact, 1 = prefix, 2 = fuzzy

export function matchBooks(
    query: string,
    books: Book[],
    { fuzzy = true }: { fuzzy?: boolean } = {}
): BookMatch[] {
    const search = normalize(query);
    if (!search) return [];

    const results: BookMatch[] = [];

    for (const { book, key } of indexBooks(books)) {
        if (key === search) {
            results.push({ book, rank: 0, distance: 0 });
        } else if (key.startsWith(search)) {
            results.push({ book, rank: 1, distance: key.length - search.length });
        } else if (fuzzy && search.length >= 3) {
            const distance = levenshtein(search, key);
            const allowed = key.length <= 4 ? 1 : 2;
            if (distance <= allowed) results.push({ book, rank: 2, distance });
        }
    }

    return results.sort((a, b) => a.rank - b.rank || a.distance - b.distance);
}

// Best single guess (exact, then prefix, then fuzzy)
export function findBook(query: string, books: Book[]): Book | undefined {
    return matchBooks(query, books)[0]?.book;
}

// Longest book name at the start of the text wins ("1 john" beats "john")
function resolveBookPrefix(text: string, books: Book[]) {
    const normalized = normalize(text);

    return indexBooks(books)
        .sort((a, b) => b.key.length - a.key.length)
        .find(
            ({ key }) => normalized === key || normalized.startsWith(key + " ")
        );
}

// ---------- Parsing ----------

export function parseBibleReference(
    input: string,
    books: Book[],
    counts: ScriptureCounts = {}
): ParsedReference {
    const match = normalize(input).match(/^(.+?)\s+(\d+)(?::(\d+))?$/);

    if (!match) {
        return { valid: false, error: "Invalid reference format." };
    }

    const [, bookQuery, chapterString, verseString] = match;

    // Accept an exact name, or a prefix that points at exactly one book
    const candidates = matchBooks(bookQuery, books, { fuzzy: false });
    const exact = candidates.find(c => c.rank === 0);
    const book =
        exact?.book ?? (candidates.length === 1 ? candidates[0].book : undefined);

    if (!book) {
        return { valid: false, error: "Unknown Bible book." };
    }

    const chapter = Number(chapterString);
    const chapterTotal = counts.chapterCount?.(book.id);

    if (chapter < 1 || (chapterTotal !== undefined && chapter > chapterTotal)) {
        return { valid: false, error: `Invalid chapter for ${book.name}.` };
    }

    let verse: number | undefined;

    if (verseString !== undefined) {
        verse = Number(verseString);
        const verseTotal = counts.verseCount?.(book.id, chapter);

        if (verse < 1 || (verseTotal !== undefined && verse > verseTotal)) {
            return {
                valid: false,
                error:
                    verseTotal !== undefined
                        ? `Invalid verse. ${book.name} ${chapter} has ${verseTotal} verses.`
                        : `Invalid verse for ${book.name} ${chapter}.`,
            };
        }
    }

    return { valid: true, reference: { book, chapter, verse } };
}

export function formatBibleReference({ book, chapter, verse }: BibleReference) {
    return `${book.name} ${chapter}${verse !== undefined ? `:${verse}` : ""}`;
}

// ---------- Suggestions ----------

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

export function getBibleSuggestions(
    input: string,
    books: Book[],
    counts: ScriptureCounts = {}
): BibleSuggestion[] {
    const query = input.trimStart();
    if (!query) return [];

    const resolved = resolveBookPrefix(query, books);
    const book = resolved?.book;
    const remainder = resolved
        ? normalize(query).slice(resolved.key.length).trim()
        : "";

    // Still typing the book name ("john" with no space or numbers yet)
    if (!resolved || (!remainder && !/\s$/.test(query))) {
        return matchBooks(query, books).map(({ book }) => ({
            label: book.name,
            value: `${book.name} `,
            type: "BOOK" as const,
        }));
    }

    // Book chosen, now the chapter
    if (/^\d*$/.test(remainder)) {
        const total = counts.chapterCount?.(book!.id);

        // No chapter data: just echo what was typed
        if (total === undefined) {
            return remainder
                ? [
                      {
                          label: `${book!.name} ${remainder}`,
                          value: `${book!.name} ${remainder}:`,
                          type: "CHAPTER" as const,
                      },
                  ]
                : [];
        }

        return range(total)
            .filter(c => String(c).startsWith(remainder))
            .map(c => ({
                label: `${book!.name} ${c}`,
                value: `${book!.name} ${c}:`,
                type: "CHAPTER" as const,
            }));
    }

    // Chapter chosen, now the verse
    const m = remainder.match(/^(\d+):(\d*)$/);
    if (!m) return [];

    const chapter = Number(m[1]);
    const verseSearch = m[2];
    const total = counts.verseCount?.(book!.id, chapter);

    if (total === undefined) {
        return verseSearch
            ? [
                  {
                      label: `${book!.name} ${chapter}:${verseSearch}`,
                      value: `${book!.name} ${chapter}:${verseSearch}`,
                      type: "VERSE" as const,
                  },
              ]
            : [];
    }

    return range(total)
        .filter(v => String(v).startsWith(verseSearch))
        .map(v => ({
            label: `${book!.name} ${chapter}:${v}`,
            value: `${book!.name} ${chapter}:${v}`,
            type: "VERSE" as const,
        }));
}