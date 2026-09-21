import type { CrossReference } from "@/types/main";

export async function fetchCrossReferences(
  translation: string,
  bookName: string,
  chapterNumber: number,
  verse: number
): Promise<CrossReference[]> {
  const res = await fetch(
    `http://localhost:9090/api/${translation.toLocaleLowerCase()}/cross-references/${bookName}/${chapterNumber}/${verse}`,
    { method: "GET" }
  );

  if (res.ok) {
    return await res.json();
  }

  throw new Error(`Failed to fetch cross references: ${res.status}`);
}