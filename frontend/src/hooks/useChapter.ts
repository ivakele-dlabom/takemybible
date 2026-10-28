import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { fetchChapterCount } from "@/api/chapters";
import { chapterKeys } from "@/api/queryKeys";

export function useChapterCount() {
  const { bookNumber } = useParams<{ bookNumber: string }>();
  const bookId = Number(bookNumber);

  return useQuery({
    queryKey: chapterKeys.byBookId(bookId),
    queryFn: () => fetchChapterCount(bookId),
    enabled: Number.isInteger(bookId) && bookId > 0,
  });
}
