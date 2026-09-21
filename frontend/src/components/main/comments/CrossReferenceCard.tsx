import { useEffect, useState } from "react";
import { ExternalLink, ChevronUp, ChevronDown, Copy } from "lucide-react";
import type { CrossReference, Verse } from "@/types/main.ts";
import { BACKEND_BASE_URL } from "@/utils/constants.ts";
import { useBookNavigation } from "@/contexts/BookContext.tsx";

interface CrossReferenceCardProps {
    reference: CrossReference;
    /** The quoted verse text — not part of CrossReference, since that's usually fetched separately. */
    verseText?: string;
    /** Optional topic tag shown as a chip, e.g. "Deity • Creation". */
    category?: string;
    onOpenReference?: (reference: CrossReference) => void;
    onVote?: (reference: CrossReference, direction: "up" | "down") => void;
    onCopy?: (reference: CrossReference) => void;
    onCompareText?: (reference: CrossReference) => void;
}

function formatVerseRange(chapter: number, start: number, end: number) {
    return start === end ? `${chapter}:${start}` : `${chapter}:${start}–${end}`;
}

export default function CrossReferenceCard({
    reference,
    category,
    onOpenReference,
    onVote,
    onCopy,
    onCompareText,
}: CrossReferenceCardProps) {
    const [votes, setVotes] = useState(reference.votes);
    const { translation, books } = useBookNavigation();
    const [verseText, setVerseText] = useState<string[]>([]);

    // Returns undefined while books haven't loaded or if the name isn't found.
    const getBookId = (bookName: string) =>
        books.find((b) => b.name === bookName)?.id;

    useEffect(() => {
        const bookId = getBookId(reference.toBook);
        if (bookId === undefined || !translation) return; // books not loaded yet

        const controller = new AbortController();

        async function getVerses() {
            try {
                const url = `${BACKEND_BASE_URL}api/${translation.toLowerCase()}/verses/${bookId}/${reference.toChapter}/${reference.toVerseStart}/${reference.toVerseEnd}`;
                const response = await fetch(url, { signal: controller.signal });

                if (!response.ok) {
                    setVerseText([]);
                    return;
                }

                const data: Verse[] = await response.json();
                setVerseText(data.map((v) => v.text));
            } catch (err) {
                if ((err as Error).name !== "AbortError") {
                    console.error("Failed to fetch verses", err);
                }
            }
        }

        getVerses();
        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        books,
        reference.toBook,
        reference.toChapter,
        reference.toVerseStart,
        reference.toVerseEnd,
        translation,
    ]);

    const handleVote = (direction: "up" | "down") => {
        setVotes((v) => v + (direction === "up" ? 1 : -1));
        onVote?.(reference, direction);
    };

    const handleCopy = () => {
        if (verseText.length > 0) {
            navigator.clipboard?.writeText(verseText.join(" ")).catch(() => {});
        }
        onCopy?.(reference);
    };

    const toHeading = `${reference.toBook} ${formatVerseRange(
        reference.toChapter,
        reference.toVerseStart,
        reference.toVerseEnd
    )}`;

    return (
        <div className="w-full max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={() => onOpenReference?.(reference)}
                        className="flex items-center gap-1.5 text-xl font-bold text-blue-900 hover:text-blue-700"
                    >
                        {toHeading}
                        <ExternalLink size={16} />
                    </button>

                    {category && (
                        <span className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-bold uppercase tracking-wide text-blue-700">
                            {category}
                        </span>
                    )}

                    <span className="text-sm text-gray-400">
                        toVerse: {reference.toVerseStart}-{reference.toVerseEnd}
                    </span>
                </div>

                <div className="flex flex-none flex-col items-center rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                    <button
                        type="button"
                        aria-label="Upvote"
                        onClick={() => handleVote("up")}
                        className="text-gray-500 hover:text-gray-800"
                    >
                        <ChevronUp size={20} />
                    </button>
                    <span className="py-1 text-lg font-bold text-gray-900">
                        +{votes}
                    </span>
                    <button
                        type="button"
                        aria-label="Downvote"
                        onClick={() => handleVote("down")}
                        className="text-gray-500 hover:text-gray-800"
                    >
                        <ChevronDown size={20} />
                    </button>
                </div>
            </div>

            {verseText.length > 0 &&
                verseText.map((item, index) => (
                    <blockquote
                        key={index}
                        className="flex flex-row mt-4 border-l-4 text-left border-blue-500 pl-4 font-fira-propo font-bold leading-relaxed text-gray-800 gap-1"
                    >
                        <span className={"text-red-400"}>{index + 1}</span>
                        <span>{item}</span>
                    </blockquote>
                ))}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-4">
                <span className="text-sm font-medium text-gray-500">
                    {reference.fromBook} {reference.fromChapter}:{reference.fromVerse}
                    {" → "}
                    {toHeading}
                </span>

                <div className="flex items-center gap-5">
                    <button
                        type="button"
                        onClick={handleCopy}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                        <Copy size={16} />
                        Copy
                    </button>
                    <button
                        type="button"
                        onClick={() => onCompareText?.(reference)}
                        className="text-sm font-semibold text-gray-800 hover:text-gray-950"
                    >
                        Compare text
                    </button>
                </div>
            </div>
        </div>
    );
}