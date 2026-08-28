import type {  Verse } from "@/types/main";

export async function fetchVerses(translation: string, bookId: number, chapterId: number): Promise<Verse[]> {
  const res = await fetch(`http://localhost:9090/api/${translation.toLowerCase()}/books/${bookId}/chapters/${chapterId}/verses`,
    { method: "GET" }
  );
  if (res.ok) {
    const responceVerses: Verse[] = await res.json()
    return responceVerses;

  }
  throw new Error(`Failed to fetch books: ${res.status}`);
}
