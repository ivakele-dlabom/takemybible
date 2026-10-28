import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Chapter } from "./Chapter.tsx";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "../ui/dropdown-menu.tsx";
import { Button } from "../ui/button.tsx";
import { useBooks } from "@/hooks/useBooks.ts";
import { useVerses } from "@/hooks/useVerse.ts";
import { useChapterCount } from "@/hooks/useChapter.ts";
import { useBookNavigation } from "@/contexts/BookContext.tsx";
import { VerseFeed } from "@/components/main/comments/VerseFeed.tsx";
import { useVerseSelection } from "@/contexts/VerseSelectionContext.tsx";

interface Props {
  className?: string;
}

export const BookDisplay = ({ className = "" }: Props) => {
  const navigate = useNavigate();
  const { data: books, isLoading, isError, error } = useBooks();
  const { data: verses } = useVerses();
  const { data: chapterCount, isLoading: isChapterCountLoading } = useChapterCount();
  const { setBooks, translation } = useBookNavigation();
  const { setSelectedVerseId, setSelectedVerseNumber } = useVerseSelection();
  const { bookNumber, chapterNumber, verseNumber } = useParams<{
    bookNumber: string;
    chapterNumber: string;
    verseNumber: string;
  }>();

  // Keep verse selection in sync with the URL
  useEffect(() => {
    if (verseNumber) {
      const n = Number(verseNumber);
      setSelectedVerseNumber(n);
      setSelectedVerseId(n);
    }
  }, [verseNumber, setSelectedVerseNumber, setSelectedVerseId]);

  // Keep the fetched books in sync with the navigation context
  useEffect(() => {
    if (books) setBooks(books);
  }, [books, setBooks]);

  const goToBook = (index: number) => {
    setSelectedVerseId(1);
    setSelectedVerseNumber(1);
    navigate(`/${translation}/${index + 1}/1/1`);
  };

  const goToChapter = (chapterNum: number) => {
    setSelectedVerseId(1);
    setSelectedVerseNumber(1);
    navigate(`/${translation}/${bookNumber}/${chapterNum}/1`);
  };

  if (isLoading) {
    return (
      <section className={`${className} flex items-center justify-center min-h-screen`}>
        <p className="text-neutral-400">Loading books...</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className={`${className} flex items-center justify-center min-h-screen`}>
        <p className="text-red-500">Failed to load books: {error?.message}</p>
      </section>
    );
  }

  if (!books || books.length === 0) {
    return (
      <section className={`${className} flex items-center justify-center min-h-screen`}>
        <p className="text-neutral-400">No books available.</p>
      </section>
    );
  }

  const currentBook = books[Number(bookNumber ?? 1) - 1];
  const chapters = Array.from({ length: chapterCount?.count ?? 0 }, (_, i) => i + 1);

  return (
    <section className={`${className} flex-col pt-4`}>
      <section className="sticky backdrop-blur-md mx-auto w-1/2 bg-white/30 top-0 z-20 flex flex-col gap-2">
        {/* Book selector */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" className="h-12 flex-row font-bold text-4xl">
                <span className="pb-3 pl-6 pr-3 fill-gray-500">{currentBook?.name}</span>
                <ChevronDown className="size-6" />
              </Button>
            }
          />
          <DropdownMenuContent
            className="w-55 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100 overflow-y-auto h-60"
            align="start"
          >
            <DropdownMenuGroup>
              {books.map((b, index) => (
                <DropdownMenuItem key={b.id} onClick={() => goToBook(index)}>
                  {b.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Chapter selector */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" className="h-10 flex-row font-bold text-2xl">
                <span className="pb-3 pl-6 pr-3 fill-gray-500 outline-none">
                  {"Chapter: " + (chapterNumber ?? 1)}
                </span>
                <ChevronDown className="size-6" />
              </Button>
            }
          />
          <DropdownMenuContent
            className="w-55 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100 overflow-y-auto h-60"
            align="start"
          >
            <DropdownMenuGroup>
              {chapters.map((n) => (
                <DropdownMenuItem
                  key={n}
                  disabled={isChapterCountLoading}
                  onClick={() => goToChapter(n)}
                >
                  {"Chapter: " + n}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>

      <section className="flex flex-row p-2">
        <section className="flex flex-row gap-4">
          <Chapter verses={verses} onVerseSelect={setSelectedVerseId} />
        </section>
        <VerseFeed />
      </section>
    </section>
  );
};
