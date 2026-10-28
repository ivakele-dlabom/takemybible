import { useQuery } from "@tanstack/react-query";
import type { CrossReference } from "@/types/main";
import { useBookNavigation } from "@/contexts/BookContext.tsx";
import { crossReferenceKeys } from "@/api/queryKeys.ts";
import { fetchCrossReferences } from "@/api/crossReferences.ts";
import {useAuth} from "@/contexts/AuthContext.tsx";
import { useParams } from "react-router-dom";

export function useCrossReferences(verse: number) {
  const { translation, books } = useBookNavigation();
  const {user}= useAuth();
const { bookNumber, chapterNumber } = useParams<{ bookNumber: string; chapterNumber: string }>();
  const bN: number = Number(bookNumber);
  const cN: number = Number(chapterNumber);

  // books are 1-indexed via bN; the fetched list is 0-indexed
  const bookName = books[bN - 1]?.name ?? "";

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<CrossReference[]>({
    queryKey: crossReferenceKeys.byVerse(translation, bookName, cN, verse),
    queryFn: () => fetchCrossReferences(translation, bookName, cN, verse, user?.userId),
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
