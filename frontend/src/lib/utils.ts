import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { string } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



type HttpMethod = "GET" | "HEAD" | "POST" | "PUT" | "DELETE";

export async function fetchData<T>(
    url: string,
    method: HttpMethod = "GET",
    body?: unknown
): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`${method} ${url} failed: ${response.status} ${response.statusText}`);
  }

  // No content (e.g. 204 or HEAD), so there's nothing to parse
  if (response.status === 204 || method === "HEAD") {
    return undefined as T;
  }

  return response.json() as Promise<T>;
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




export type BibleBook = {
    name: string;
    abbreviation: string;
    chapters: number[];
    aliases?: string[];
};

export type BibleReference = {
    book: BibleBook;
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

const books = bibleBooks as BibleBook[];

// Normalize names and abbreviations
const normalize = (value: string) =>
    value
        .toLowerCase()
        .replace(/[.]/g, "")
        .replace(/\s+/g, " ")
        .trim();

// Levenshtein distance for fuzzy matching
function levenshtein(a: string, b: string): number {
    const matrix = Array.from(
        { length: a.length + 1 },
        (_, i) => [i, ...Array(b.length).fill(0)]
    );

    for (let j = 0; j <= b.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] +
                (a[i - 1] === b[j - 1] ? 0 : 1)
            );
        }
    }

    return matrix[a.length][b.length];
}

// All names that can identify a book
function getBookNames(book: BibleBook): string[] {
    return [
        book.name,
        book.abbreviation,
        ...(book.aliases ?? [])
    ].map(normalize);
}

// Find a book using its name, abbreviation or fuzzy match
export function findBook(query: string): BibleBook | undefined {
    const search = normalize(query);

    if (!search) return undefined;

    // Exact match
    const exact = books.find(book =>
        getBookNames(book).includes(search)
    );

    if (exact) return exact;

    // Prefix match
    const prefix = books.find(book =>
        getBookNames(book).some(name => name.startsWith(search))
    );

    if (prefix) return prefix;

    // Fuzzy match
    const matches = books
        .map(book => ({
            book,
            score: Math.min(
                ...getBookNames(book).map(name =>
                    levenshtein(search, name)
                )
            )
        }))
        .filter(({ book, score }) => {
            const shortest = Math.min(
                ...getBookNames(book).map(name => name.length)
            );

            // Allow only reasonably close matches
            return score <= (shortest <= 4 ? 1 : 2);
        })
        .sort((a, b) => a.score - b.score);

    return matches[0]?.book;
}

// Resolve a book at the beginning of a reference.
// Longest matching name wins, which handles "1 John", etc.
function resolveBookPrefix(query: string) {
    const normalized = normalize(query);

    const candidates = books.flatMap(book =>
        getBookNames(book).map(name => ({ book, name }))
    );

    candidates.sort((a, b) => b.name.length - a.name.length);

    return candidates.find(({ name }) =>
        normalized === name ||
        normalized.startsWith(name + " ")
    );
}

// Validate a complete reference
export function parseBibleReference(
    input: string
): ParsedReference {
    const value = input.trim();

    const match = value.match(/^(.+?)\s+(\d+)(?::(\d+))?$/);

    if (!match) {
        return {
            valid: false,
            error: "Invalid reference format."
        };
    }

    const [, bookQuery, chapterString, verseString] = match;

    const book = findBook(bookQuery);

    if (!book || normalize(bookQuery) !== normalize(book.name) &&
        !getBookNames(book).includes(normalize(bookQuery))) {
        return {
            valid: false,
            error: "Unknown Bible book."
        };
    }

    const chapter = Number(chapterString);

    if (
        !Number.isInteger(chapter) ||
        chapter < 1 ||
        chapter > book.chapters.length
    ) {
        return {
            valid: false,
            error: `Invalid chapter for ${book.name}.`
        };
    }

    let verse: number | undefined;

    if (verseString !== undefined) {
        verse = Number(verseString);

        if (
            !Number.isInteger(verse) ||
            verse < 1 ||
            verse > book.chapters[chapter - 1]
        ) {
            return {
                valid: false,
                error: `Invalid verse. ${book.name} ${chapter} has ${book.chapters[chapter - 1]} verses.`
            };
        }
    }

    return {
        valid: true,
        reference: {
            book,
            chapter,
            verse
        }
    };
}

// Return the canonical representation of a valid reference
export function formatBibleReference(
    reference: BibleReference
): string {
    return `${reference.book.name} ${reference.chapter}${
        reference.verse !== undefined
            ? `:${reference.verse}`
            : ""
    }`;
}

// Generate autocomplete suggestions
export function getBibleSuggestions(
    input: string
): BibleSuggestion[] {
    const query = input.trimStart();

    if (!query) return [];

    // Find a book prefix, including abbreviations and numbered books.
    const resolved = resolveBookPrefix(query);

    if (!resolved) {
        // Book suggestions
        const search = normalize(query);

        return books
            .map(book => {
                const names = getBookNames(book);

                const exactPrefix = names.some(name =>
                    name.startsWith(search)
                );

                const fuzzyScore = Math.min(
                    ...names.map(name => levenshtein(search, name))
                );

                return {
                    book,
                    exactPrefix,
                    fuzzyScore
                };
            })
            .filter(({ exactPrefix, fuzzyScore }) =>
                exactPrefix || fuzzyScore <= 2
            )
            .sort((a, b) =>
                Number(b.exactPrefix) - Number(a.exactPrefix) ||
                a.fuzzyScore - b.fuzzyScore
            )
            .map(({ book }) => ({
                label: book.name,
                value: `${book.name} `,
                type: "BOOK" as const
            }));
    }

    const { book, name } = resolved;
    const remainder = normalize(query).slice(name.length).trim();

    // Book selected, suggest chapters
    if (!remainder || /^\d+$/.test(remainder)) {
        const search = remainder;

        return book.chapters
            .map((_, index) => index + 1)
            .filter(chapter =>
                String(chapter).startsWith(search)
            )
            .map(chapter => ({
                label: `${book.name} ${chapter}`,
                value: `${book.name} ${chapter}:`,
                type: "CHAPTER" as const
            }));
    }

    // Chapter selected, suggest verses
    const match = remainder.match(/^(\d+):(\d*)$/);

    if (match) {
        const chapter = Number(match[1]);
        const verseSearch = match[2];

        const verseCount = book.chapters[chapter - 1];

        if (!verseCount) return [];

        return Array.from(
            { length: verseCount },
            (_, index) => index + 1
        )
            .filter(verse =>
                String(verse).startsWith(verseSearch)
            )
            .map(verse => ({
                label: `${book.name} ${chapter}:${verse}`,
                value: `${book.name} ${chapter}:${verse}`,
                type: "VERSE" as const
            }));
    }

    return [];
}

