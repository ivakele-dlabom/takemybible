import { useQuery } from "@tanstack/react-query";

interface Book {
  id: number;
  name: string;
}

async function fetchKjvBooks(): Promise<Book[]> {
  const res = await fetch("/api/book/kjv");
  if (!res.ok) {
    throw new Error(`Failed to fetch books: ${res.status}`);
  }
  return res.json();
}

export function useKjvBooks() {
  return useQuery({
    queryKey: ["books", "kjv"],
    queryFn: fetchKjvBooks,
  });
}
