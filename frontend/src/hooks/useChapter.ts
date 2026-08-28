import { useQuery } from "@tanstack/react-query";
import { fetchChapterCount } from "@/api/chapters";
import { useBookNavigation } from "@/contexts/BookContext.tsx";
import { chapterKeys } from "../api/queryKeys";

export function useChapterCount() {
  const { bookNumber } = useBookNavigation();
  return useQuery({
    queryKey: chapterKeys.byBookId(bookNumber),
    queryFn: () => fetchChapterCount(bookNumber),
  });
}
