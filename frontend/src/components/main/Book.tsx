import { useState, useEffect } from "react";
import { Chapter } from "./Chapter.tsx";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem
} from "../ui/dropdown-menu";
import { Button } from "../ui/button.tsx";
import { ChevronDown } from "lucide-react";
import CommentsFeed from "@/components/main/comments/CommentsFeed.tsx";
import { useBooks } from "@/hooks/useBooks.ts";



interface Props {
    className?: string;
}

export const BookDisplay = ({ className }: Props) => {
    const { data: books, isLoading, isError, error } = useBooks();
    const [bookIndex, setBookIndex] = useState(0);
    const [chapterIndex, setChapterIndex] = useState(0);
    const [selectedVerseId, setSelectedVerseId] = useState<number | null>(null);
  if (!books) {
    return;
    }




    const handleChapterSelection = (e: React.MouseEvent<HTMLButtonElement>) => {
        const idx = Number.parseInt(e.currentTarget.id);
        setChapterIndex(idx);
        setSelectedVerseId(null);
    };

    const handleSelectedBook = (e: React.MouseEvent<HTMLButtonElement>) => {
        const idx = Number.parseInt(e.currentTarget.id);
        setBookIndex(idx);
        setChapterIndex(0);
        setSelectedVerseId(null);
    };

    if (isLoading) {
        return (
            <section className={className + " flex items-center justify-center min-h-screen"}>
                <p className="text-neutral-400">Loading books...</p>
            </section>
        );
    }

    if (books.length === 0) {
        return (
            <section className={className + " flex items-center justify-center min-h-screen"}>
                <p className="text-neutral-400">No books available.</p>
            </section>
        );
    }

    const currentBook = books[bookIndex];
    const currentChapter = currentBook?.chapters[chapterIndex];
    const verses = currentChapter?.verses ?? [];

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
                                {"Chapter: " + (currentChapter ? currentChapter.chapter : chapterIndex + 1)}
                            </span>
                            <ChevronDown className="size-6" />
                        </Button>} />
                    <DropdownMenuContent className="w-55 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100 overflow-y-auto h-60" align="start">
                        {currentBook.chapters.map((ch, index) => (
                            <DropdownMenuGroup key={ch.chapter}>
                                <DropdownMenuItem>
                                    <button className={"w-full"} id={"" + index} onClick={handleChapterSelection}>
                                        {"Chapter: " + ch.chapter}
                                    </button>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </section>

            <section className="flex flex-row gap-4">
                {verses.length === 0 ? (
                    <div className="flex-3 flex items-center justify-center p-12">
                        <p className="text-neutral-400">Loading verses...</p>
                    </div>
                ) : (
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
