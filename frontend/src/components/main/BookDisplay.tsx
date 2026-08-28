import { useState, useEffect } from "react";
import { Chapter } from "./Chapter.tsx";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem
} from "../ui/dropdown-menu.tsx";
import { Button } from "../ui/button.tsx";
import { ChevronDown } from "lucide-react";
import CommentsFeed from "@/components/main/comments/CommentsFeed.tsx";
import { useBooks } from "@/hooks/useBooks.ts";
import { useVerses } from "@/hooks/useVerse.ts";
import { useChapterCount } from "@/hooks/useChapter.ts";
import { useBookNavigation } from "@/contexts/BookContext.tsx";



interface Props {
  className?: string;
}

export const BookDisplay = ({ className }: Props) => {
  const { data: books, isLoading, isError, error } = useBooks();
  const { data: verses, isLoading: isVersesLoading, isError: isVersesError, error: versesError } = useVerses();
  const { data: chapterCount, isLoading: isChapterCountLoading, isError: isChapterCountError, error: chapterCountError } = useChapterCount();
  const { chapterNumber } = useBookNavigation();


  const [bookIndex, setBookIndex] = useState(1);
  const [chapterIndex, setChapterIndex] = useState(1);
  const [selectedVerseId, setSelectedVerseId] = useState<number>(1);

  const handleChapterSelection = (e: React.MouseEvent<HTMLButtonElement>) => {
    const idx = Number.parseInt(e.currentTarget.id);
    setChapterIndex(idx);
    setSelectedVerseId(1);
  };

  const handleSelectedBook = (e: React.MouseEvent<HTMLButtonElement>) => {
    const idx = Number.parseInt(e.currentTarget.id);
    setBookIndex(idx);
    setChapterIndex(1);
    setSelectedVerseId(1 );
  };

  if (isLoading) {
    return (
      <section className={className + " flex items-center justify-center min-h-screen"}>
        <p className="text-neutral-400">Loading books...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className={className + " flex items-center justify-center min-h-screen"}>
        <p className="text-red-500">Failed to load books: {error?.message}</p>
      </section>
    );
  }

  if (!books || books.length === 0) {
    return (
      <section className={className + " flex items-center justify-center min-h-screen"}>
        <p className="text-neutral-400">No books available.</p>
      </section>
    );
  }

  const currentBook = books[bookIndex];

  return (
    <section className={className + " flex-col mt-4"}>
      <section className={"sticky top-0 z-20 flex flex-col gap-2 bg-white"}>
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="outline" className="h-12 flex-row font-bold text-4xl">
              <span className="pb-3 pl-6 pr-3 fill-gray-500">{currentBook?.name}</span>
              <ChevronDown className="size-6" />
            </Button>} />
          <DropdownMenuContent className="w-55 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100 overflow-y-auto h-60" align="start">
            {books.map((b, index) => (
              <DropdownMenuGroup key={b.id}>
                <DropdownMenuItem>
                  <button className={"w-full"} id={"" + index} onClick={handleSelectedBook}>{b.name}</button>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="outline" className="h-10 flex-row font-bold text-2xl">
              <span className="pb-3 pl-6 pr-3 fill-gray-500 outline-none">
                {"Chapter: " + (chapterNumber ?? chapterIndex + 1)}
              </span>
              <ChevronDown className="size-6" />
            </Button>
          } />

          <DropdownMenuContent className="w-55 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100 overflow-y-auto h-60" align="start">
            {Array.from({ length: chapterCount != undefined ? chapterCount.count : 0 }, (_, i) => i + 1).map((chapterNum) => (
              <DropdownMenuGroup key={chapterNum}>
                <DropdownMenuItem>
                  <button className="w-full" id={"" + chapterNum} onClick={handleChapterSelection}>
                    {"Chapter: " + chapterNum}
                  </button>
                </DropdownMenuItem>

              </DropdownMenuGroup>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </section>

      <section className="flex flex-row gap-4">
        {(
          <Chapter
          className="h-164 overflow-y-auto [&::-webkit-scrollbar]:h-[6px] [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-400"
          verses={verses}
          onVerseSelect={setSelectedVerseId}
          />
        )}

        <CommentsFeed className="" verseId={selectedVerseId} />
      </section>
    </section>
  );
};
