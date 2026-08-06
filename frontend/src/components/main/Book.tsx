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
import { useBookNavigation } from "../../contexts/BookContext.tsx";
import CommentsFeed from "@/components/main/comments/CommentsFeed.tsx";
import type { VerseData } from "./VerseDisplay.tsx";

interface Props {
    className?: string;
}

export const Book = ({ className }: Props) => {
    const { books, setChapterNumber, bookNumber, chapterNumber, setBookNumber } = useBookNavigation();
    const book = books[bookNumber];
    const chapters = books[bookNumber].chapters;

    const [verses, setVerses] = useState<VerseData[]>([]);
    const [selectedVerseId, setSelectedVerseId] = useState<number | null>(null);
    const [loadingVerses, setLoadingVerses] = useState(false);

    useEffect(() => {
        const fetchVerses = async () => {
            setLoadingVerses(true);
            setSelectedVerseId(null);
            try {
                const response = await fetch(
                    `http://localhost:9090/api/bible/books/${book.id}/chapters/${chapterNumber + 1}/verses`
                );
                if (response.ok) {
                    const data = await response.json();
                    setVerses(data);
                } else {
                    // Fallback to local data if backend not available
                    const localVerses = book.chapters[chapterNumber]?.verses || [];
                    setVerses(localVerses.map((v, i) => ({
                        id: i + 1,
                        verseNumber: i + 1,
                        text: v.text,
                        commentCount: 0,
                    })));
                }
            } catch {
                // Fallback to local data
                const localVerses = book.chapters[chapterNumber]?.verses || [];
                setVerses(localVerses.map((v, i) => ({
                    id: i + 1,
                    verseNumber: i + 1,
                    text: v.text,
                    commentCount: 0,
                })));
            } finally {
                setLoadingVerses(false);
            }
        };

        fetchVerses();
    }, [bookNumber, chapterNumber, book.id]);

    const handleChapterSelection = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const selectedChapterIndex = Number.parseInt(e.currentTarget.id);
        setChapterNumber(selectedChapterIndex);
    };

    const handleSelectedBook = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const selectedBookIndex = Number.parseInt(e.currentTarget.id);
        setBookNumber(selectedBookIndex);
        setChapterNumber(0);
    };

    return (
        <section className={className + "flex-col mt-4"}>
            <section className={"sticky top-0 z-20 flex flex-col gap-2 bg-white"}>
                <DropdownMenu>
                    <DropdownMenuTrigger render={
                        <Button variant="outline" className="h-12 flex-row font-bold text-4xl">
                            <span className="pb-3 pl-6 pr-3 fill-gray-500">{books[bookNumber].name}</span>
                            <ChevronDown className="size-6" />
                        </Button>} />
                    <DropdownMenuContent className="w-55 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100 overflow-y-auto h-60" align="start">
                        {books.map((b, index) => (
                            <DropdownMenuGroup key={index}>
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
                            <span className="pb-3 pl-6 pr-3 fill-gray-500 outline-none">{"Chapter: " + (chapterNumber + 1)}</span>
                            <ChevronDown className="size-6" />
                        </Button>} />
                    <DropdownMenuContent className="w-55 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100 overflow-y-auto h-60" align="start">
                        {chapters.map((_, index) => (
                            <DropdownMenuGroup key={index}>
                                <DropdownMenuItem>
                                    <button className={"w-full"} id={"" + index} onClick={handleChapterSelection}>{"Chapter: " + (index + 1)}</button>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </section>

            <section className="flex flex-row gap-4">
                {loadingVerses ? (
                    <div className="flex-3 flex items-center justify-center p-12">
                        <p className="text-neutral-400">Loading verses...</p>
                    </div>
                ) : (
                    <Chapter
                        className="h-164 overflow-y-auto scrollbar-thin scrollbar-w-6 scrollbar-thumb-emerald-500 scrollbar-track-gray-100"
                        verses={verses}
                        onVerseSelect={setSelectedVerseId}
                    />
                )}

                <CommentsFeed className="" verseId={selectedVerseId} />
            </section>
        </section>
    );
};
