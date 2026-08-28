import { useQuery } from "@tanstack/react-query";
import { fetchBooks } from "@/api/books";
import {useBookNavigation} from "@/contexts/BookContext.tsx";
import { bookKeys } from "../api/queryKeys";

export function useBooks() {
  const { translation } = useBookNavigation();
  return useQuery({
    queryKey: bookKeys.byTranslation(translation),
    queryFn: () => fetchBooks(translation),
  });
}
