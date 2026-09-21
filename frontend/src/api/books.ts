import type { Book } from "@/types/main";

export async function fetchBooks(translation: string): Promise<Book[]> {
  const res = await fetch(`http://localhost:9090/api/${translation.toLowerCase()}/books`, { method: "GET" });

  if (res.ok) {

    const data = await res.json();

    return data.map((book: { id: number; name: string }) => ({
      id: book.id,
      name: book.name,
      chapters: [],
    }));
  }

  throw new Error(`Failed to fetch books: ${res.status}`);
}
