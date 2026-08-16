import type { Book } from "@/types/main";


export async function fetchBooks(version: string): Promise<Book[]> {
  const res = await fetch(`/api/book/${version}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch books: ${res.status}`);
  }
  return res.json();
}
