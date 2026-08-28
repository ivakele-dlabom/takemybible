
import { useQuery } from "@tanstack/react-query";
import { fetchVerses } from "@/api/verses";
import {useBookNavigation} from "@/contexts/BookContext.tsx";
import {  verseKeys } from "../api/queryKeys";

export function useVerses() {
  const { translation, bookNumber, chapterNumber } = useBookNavigation();
  return useQuery({
    queryKey: verseKeys.byBookIdChapterId(translation, bookNumber, chapterNumber),
    queryFn: () => fetchVerses(translation, bookNumber, chapterNumber),
  });
}
