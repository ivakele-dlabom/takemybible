import { useQuery } from "@tanstack/react-query";
import type { CrossReference } from "@/types/main";
import { useBookNavigation } from "@/contexts/BookContext.tsx";
import { crossReferenceKeys } from "@/api/queryKeys.ts";
import { fetchCrossReferences } from "@/api/crossReferences.ts";

export function useCrossReferences(verse: number) {
  const { translation, bookNumber, chapterNumber, books } = useBookNavigation();

  // books are 1-indexed via bookNumber; the fetched list is 0-indexed
  const bookName = books[bookNumber - 1]?.name ?? "";

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<CrossReference[]>({
    queryKey: crossReferenceKeys.byVerse(translation, bookName, chapterNumber, verse),
    queryFn: () => fetchCrossReferences(translation, bookName, chapterNumber, verse),
    // Only fire once we actually have a book name and a valid verse.
    // The query re-runs automatically whenever the queryKey changes
    // (i.e. when the selected verse/chapter/book changes).
    enabled: Boolean(bookName) && verse > 0,
  });

  return {
    crossReferences: data ?? [],
    isLoading,
    isFetching,
    isError,
    error,
    fetchCrossReferences: refetch, // call this to trigger the fetch
  };
}
