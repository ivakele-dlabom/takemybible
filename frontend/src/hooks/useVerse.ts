
import { useQuery } from "@tanstack/react-query";
import { fetchVerses } from "@/api/verses";
import {useBookNavigation} from "@/contexts/BookContext.tsx";
import {  verseKeys } from "../api/queryKeys";
import { useParams } from "react-router-dom";

export function useVerses() {
  const { translation } = useBookNavigation();
  const {bookNumber, chapterNumber} = useParams<{bookNumber: string; chapterNumber: string}>();
  const bN = Number(bookNumber);
  const cN = Number(chapterNumber);

  return useQuery({
    queryKey: verseKeys.byBookIdChapterId(translation, bN, cN),
    queryFn: () => fetchVerses(translation, bN, cN),
  });
}
