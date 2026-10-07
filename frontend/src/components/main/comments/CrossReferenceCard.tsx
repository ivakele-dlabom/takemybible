import { useEffect, useState } from "react";
import {ExternalLink, Copy, ArrowBigDown, ArrowBigUp} from "lucide-react";
import type { CrossReference, Verse } from "@/types/main.ts";
import { BACKEND_BASE_URL } from "@/utils/constants.ts";
import { useBookNavigation } from "@/contexts/BookContext.tsx";
import {toRoman} from "@/utils/tools.ts";
import {useAuth} from "@/contexts/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import {toast} from "@/components/ui/toast"

interface CrossReferenceCardProps {
    reference: CrossReference;
    verseText?: string;
    category?: string;
    onOpenReference?: (reference: CrossReference) => void;
    onCopy?: (reference: CrossReference) => void;
    onCompareText?: (reference: CrossReference) => void;
    id?:number;
}

function formatVerseRange(chapter: number, start: number, end: number) {
    return start === end ? `${chapter}:${start}` : `${chapter}:${start}–${end}`;
}

export default function CrossReferenceCard({
    reference,
    category,
    onOpenReference,
    onCopy,
    onCompareText,
    id
}: CrossReferenceCardProps) {
    const [votes, setVotes] = useState(reference.votes);
    const [verseText, setVerseText] = useState<string[]>([]);
    const [votingLoading, setVotingLoading] = useState(false);
    const {user} = useAuth();
    const {translation, books} = useBookNavigation();
    const navigate = useNavigate();

    if (!user) {
        navigate("/login")
        return
    }

    // Returns undefined while books haven't loaded or if the name isn't found.
    const getBookId = (bookName: string) =>{
        const splitString = bookName.split(" ")
        // check that the book name is numbered
        if (splitString.length == 2) {
            // convert the decimal to roman numeral
            // console.log(splitString)
            const romanNumber = toRoman(Number(splitString[0]))
            bookName = `${romanNumber} ${splitString[1]}`
        }
        if (bookName === "Revelation") {
            bookName = "Revelation of John"
        }
        // console.log(bookName, books.find((b) => b.name === bookName)?.id)
        return books.find((b) => b.name === bookName)?.id;
    }
    useEffect(() => {
        const bookId = getBookId(reference.toBook);
        if (bookId === undefined || !translation) {
            return
        }; // books not loaded yet

        const controller = new AbortController();

        async function getVerses() {
            try {
                const url = `${BACKEND_BASE_URL}api/${translation.toLowerCase()}/verses/${bookId}/${reference.toChapter}/${reference.toVerseStart}/${reference.toVerseEnd}`;
                const response = await fetch(url, { signal: controller.signal });
                if (!response.ok) {
                    console.log(`cant get verse ${reference.toChapter} ${reference.toVerse}`);
                    setVerseText([]);
                    return;
                }

                const data: Verse[] = await response.json();
                setVerseText(data.map((v) => {
                    console.log(v.chapter, v.verse, v.text)
                    return v.text
                }));
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

    const handleVote = async (direction: "up" | "down") => {
        setVotes((v) => v + (direction === "up" ? 1 : -1));
        setVotingLoading(true);
        try {
            const voteValue =  (direction === "up" ? 1 : -1)
            await fetch(`${BACKEND_BASE_URL}api/cross-reference/vote/${reference.id}/${user.userId}/${voteValue}`, {
                method: "GET"
            });
        } catch (e) {
            toast.add({type: "error", priority: "high", description: "Vote unsuccessful"})
            setVotes((v) => v + (direction === "up" ? -1 : -1));
        }

        setVotingLoading(true);
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
        <div key={id} className="w-full max-w-2xl rounded-sm border border-gray-200 bg-white p-6 shadow-sm">
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
                        <span className="rounded-sm border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-bold uppercase tracking-wide text-blue-700">
                            {category}
                        </span>
                    )}


                </div>

                <div className="flex flex-none flex-row gap-3 h-10 items-center rounded-sm border border-gray-200 bg-gray-50 px-3 py-2">
                    <button
                        type="button"
                        aria-label="Upvote"
                        onClick={() => handleVote("up")}
                        className="text-gray-500 hover:text-gray-800"
                        disabled={votingLoading}
                    >
                        <ArrowBigUp className={"hover:fill-amber-400 animate-in"} size={20} />
                    </button>
                    <span className="py-1 text-sm font-bold text-gray-900">
                        {votes}
                    </span>
                    <button
                        type="button"
                        aria-label="Downvote"
                        onClick={() => handleVote("down")}
                        className="text-gray-500 hover:text-gray-800"
                    >
                        <ArrowBigDown className={"hover:fill-red-300 animate-in"} size={20} />
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