import { useEffect } from "react";
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
import { useBooks } from "@/hooks/useBooks.ts";
import { useVerses } from "@/hooks/useVerse.ts";
import { useChapterCount } from "@/hooks/useChapter.ts";
import { useBookNavigation } from "@/contexts/BookContext.tsx";
import {VerseFeed} from "@/components/main/comments/VerseFeed.tsx";
import {useVerseSelection} from "@/contexts/VerseSelectionContext.tsx";



interface Props {
  className?: string;
}

export const BookDisplay = ({ className }: Props) => {
  const { data: books, isLoading, isError, error } = useBooks();
  const { data: verses } = useVerses();
  const { data: chapterCount, isLoading: isChapterCountLoading } = useChapterCount();
  const { chapterNumber, setChapterNumber, setBookNumber, bookNumber, setBooks} = useBookNavigation();
  const {setSelectedVerseId, setSelectedVerseNumber} = useVerseSelection();

  // Keep the fetched books in sync with the navigation context so other
  // consumers (e.g. useCrossReferences) can read them from context.
  useEffect(() => {
    if (books) setBooks(books);
  }, [books, setBooks]);


  const handleChapterSelection = (e: React.MouseEvent<HTMLButtonElement>) => {
    const idx = Number.parseInt(e.currentTarget.id);
    setChapterNumber (idx);
    setSelectedVerseId(1);
    setSelectedVerseNumber(1)
  };

  const handleSelectedBook = (e: React.MouseEvent<HTMLButtonElement>) => {
    const idx = Number.parseInt(e.currentTarget.id);
    console.log("bookNumber: ", bookNumber);
    console.log("idx: ", idx);
    setBookNumber(idx + 1);
    setChapterNumber(1);
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

  const currentBook = books[bookNumber - 1];

  return (
    <section className={className + " flex-col pt-4"}>
      <section className={"sticky backdrop-blur-md mx-auto w-1/2 bg-white/30 top-0 z-20 flex flex-col gap-2 "}>
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
                  <button className={"w-full"} id={"" + index } onClick={handleSelectedBook}>{b.name}</button>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="outline" className="h-10 flex-row font-bold text-2xl">
              <span className="pb-3 pl-6 pr-3 fill-gray-500 outline-none">
                {"Chapter: " + (chapterNumber ?? chapterNumber + 1)}
              </span>
              <ChevronDown className="size-6" />
            </Button>
          } />

          <DropdownMenuContent  className="w-55 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100 overflow-y-auto h-60" align="start">
            {Array.from({ length: chapterCount != undefined ? chapterCount.count : 0 }, (_, i) => i + 1).map((chapterNum) => (
              <DropdownMenuGroup  key={chapterNum}>
                <DropdownMenuItem disabled={isChapterCountLoading}>
                  <button className="w-full" id={"" + chapterNum} onClick={handleChapterSelection}>
                    {"Chapter: " + chapterNum}
                  </button>
                </DropdownMenuItem>

              </DropdownMenuGroup>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
      <section className={"flex flex-row p-2"}>
        <section className="flex flex-row gap-4">
          {(
              <Chapter
                  verses={verses}
                  onVerseSelect={setSelectedVerseId}
              />
          )}
          {/*<CommentsFeed className="" verseId={selectedVerseId} />*/}
        </section>

        <VerseFeed />
      </section>
    </section>
  );
};
