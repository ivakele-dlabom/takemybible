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
import type { VerseData } from "./VerseDisplay.tsx";

interface KjvBook {
    id: number;
    name: string;
    chapters: KjvChapter[];
}

interface KjvChapter {
    chapter: number;
    verses: VerseData[];
}

interface Props {
    className?: string;
}

export const Book = ({ className }: Props) => {
    const [books, setBooks] = useState<KjvBook[]>([]);
    const [bookIndex, setBookIndex] = useState(0);
    const [chapterIndex, setChapterIndex] = useState(0);
    const [selectedVerseId, setSelectedVerseId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch all books on mount
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch("http://localhost:9090/api/kjv/books");
                if (!response.ok) return;

                const data: { id: number; name: string }[] = await response.json();

                // Initialize books with empty chapters — chapters get filled when selected
                const booksWithChapters: KjvBook[] = data.map((b)=> ({
                    id: b.id,
                    name: b.name,
                    chapters: [],
                }));

                setBooks(booksWithChapters);
            } catch {
                // backend unavailable
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    // Fetch chapters list for the currently selected book
    useEffect(() => {
        if (books.length === 0) return;
        const book = books[bookIndex];
        if (!book || book.chapters.length > 0) return; // already fetched

        const fetchChapters = async () => {
            try {
                const response = await fetch(
                    `http://localhost:9090/api/kjv/books/${book.id}/chapters`
                );
                if (!response.ok) return;

                const chapterNumbers: number[] = await response.json();

                setBooks((prev) => {
                    const updated = [...prev];
                    updated[bookIndex] = {
                        ...updated[bookIndex],
                        chapters: chapterNumbers.map((ch) => ({ chapter: ch, verses: [] })),
                    };
                    return updated;
                });
            } catch {
                // silently fail
            }
        };

        fetchChapters();
    }, [books.length, bookIndex]);

    // Fetch verses for the currently selected chapter
    useEffect(() => {
        if (books.length === 0) return;
        const book = books[bookIndex];
        if (!book || book.chapters.length === 0) return;

        const chapter = book.chapters[chapterIndex];
        if (!chapter || chapter.verses.length > 0) return; // already fetched

        const fetchVerses = async () => {
            try {
                const response = await fetch(
                    `http://localhost:9090/api/kjv/books/${book.id}/chapters/${chapter.chapter}/verses`
                );
                if (!response.ok) return;

                const data: { id: number; verse: number; text: string; chapter: number }[] =
                    await response.json();

                const verses: VerseData[] = data.map((v) => ({
                    id: v.id,
                    verseNumber: v.verse,
                    text: v.text,
                    commentCount: 0,
                }));

                setBooks((prev) => {
                    const updated = [...prev];
                    const updatedChapters = [...updated[bookIndex].chapters];
                    updatedChapters[chapterIndex] = {
                        ...updatedChapters[chapterIndex],
                        verses,
                    };
                    updated[bookIndex] = { ...updated[bookIndex], chapters: updatedChapters };
                    return updated;
                });
            } catch {
                // silently fail
            }
        };

        fetchVerses();
    }, [books, bookIndex, chapterIndex]);

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

    if (loading) {
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
    const currentChapter = currentBook.chapters[chapterIndex];
    const verses = currentChapter?.verses ?? [];

    return (
        <section className={className + " flex-col mt-4"}>
            <section className={"sticky top-0 z-20 flex flex-col gap-2 bg-white"}>
                <DropdownMenu>
                    <DropdownMenuTrigger render={
                        <Button variant="outline" className="h-12 flex-row font-bold text-4xl">
                            <span className="pb-3 pl-6 pr-3 fill-gray-500">{currentBook.name}</span>
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
