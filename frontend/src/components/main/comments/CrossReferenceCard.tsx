import { useEffect, useState } from "react";
import {ExternalLink, Copy} from "lucide-react";
import type { CrossReference, Verse } from "@/types/main.ts";
import { BACKEND_BASE_URL } from "@/lib/constants.ts";
import { useBookNavigation } from "@/contexts/BookContext.tsx";
import {useAuth} from "@/contexts/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import {toast} from "@/components/ui/toast"
import {toRoman} from "@/lib/utils.ts";

interface CrossReferenceCardProps {
    reference: CrossReference;
    verseText?: string;
    category?: string;
    onOpenReference?: (bookName: string, chN: number, vN: number) => void;
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
    const [verseText, setVerseText] = useState<string[]>([]);
    const [votingLoading, setVotingLoading] = useState(false);
    const [referenceVote, setReferenceVote] = useState<0 | -1 | 1>(reference.userVote);
    const [numberOfVotes, setNumberOfVotes] = useState(reference.votes);
    const {user} = useAuth();
    const {translation, books} = useBookNavigation();
    const navigate = useNavigate();



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
                    setVerseText([]);
                    return;
                }

                const data: Verse[] = await response.json();
                setVerseText(data.map((v) => {
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
    }, [
        books,
        reference.toBook,
        reference.toChapter,
        reference.toVerseStart,
        reference.toVerseEnd,
        translation,
    ]);

    useEffect(() => {
        if (!user) navigate("/login");
    }, [user, navigate]);

    if (!user) {
        navigate("/login");
        return ;
    }

    const handleVote = async (direction: 1 | -1) => {
        const prevVote = referenceVote;
        const prevVotes = numberOfVotes;

        const newVote: 0 | 1 | -1 = prevVote === direction ? 0 : direction;
        const delta = newVote - prevVote; // +1/-1 for new/undo, ±2 for a switch

        setReferenceVote(newVote);
        setNumberOfVotes(prevVotes + delta);
        setVotingLoading(true);

        try {
            const response = await fetch(
                `${BACKEND_BASE_URL}api/cross-reference/vote/${reference.id}/${user.userId}/${direction}`,
                { method: "POST" }
            );
            if (!response.ok) {
                setReferenceVote(prevVote);
                setNumberOfVotes(prevVotes);
                toast.add({ type: "error", priority: "high", description: "Vote unsuccessful" });
            }
        } catch (e) {
            setReferenceVote(prevVote);
            setNumberOfVotes(prevVotes);
            toast.add({ type: "error", priority: "high", description: "Vote unsuccessful" });
        }

        setVotingLoading(false);
    };

    const handleCopy = () => {
        if (verseText.length > 0) {
            navigator.clipboard?.writeText(verseText.join(" ")).catch(() => {});
        }
        onCopy?.(reference);
    };

    const arrowButtonColors = (vote: 1 | -1) => {

        if (vote == 1) {

            return referenceVote == 0 ? " text-stone-400 hover:text-stone-700 hover:bg-stone-200/80 ": (referenceVote == 1 )? " text-emerald-700 hover:bg-emerald-100 ": " text-stone-400 hover:text-stone-700 hover:bg-stone-200/80 ";
        }
        return referenceVote == 0 ? " text-stone-400 hover:text-stone-700 hover:bg-stone-200/80 ": (referenceVote == 1 )? " text-stone-400 hover:text-stone-700 hover:bg-stone-200/80 ": " text-rose-600 hover:bg-rose-100 ";

    }

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
                        onClick={() => onOpenReference?.(reference.toBook, reference.toChapter, reference.toVerseStart)}
                        className="flex items-center group gap-1.5 text-xl font-bold text-blue-900 hover:text-blue-700"
                    >
                        {toHeading}
                        <ExternalLink
                        size={16}
                        className="transition-transform duration-200 group-hover:scale-125"
                        />
                    </button>

                    {category && (
                        <span className="rounded-sm border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-bold uppercase tracking-wide text-blue-700">
                            {category}
                        </span>
                    )}


                </div>
                {/*Voting buttons*/}
                <div
                    className={`h-7.5 gap-2 inline-flex items-center  rounded-lg  animate-in ${referenceVote === 0 ? "bg-white" : referenceVote === 1 ? " bg-emerald-50 border border-emerald-500" : " bg-rose-50 border border-rose-200 rounded-lg overflow-hidden shadow-2xs"} `}>

                    <button
                        onClick={() => handleVote(1)}
                        disabled={votingLoading}
                        aria-label="Upvote" className={`h-6.5 w-6.5 px-2 py-1 rounded-tl-md rounded-bl-md  transition-colors ${arrowButtonColors(1)}`}
                            type="button">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M5 15l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"
                                  strokeWidth="2.5"></path>
                        </svg>
                    </button>
                    <span className={`py-1 text-xs font-bold text-gray-900`}>
                        {numberOfVotes}
                    </span>
                    <button aria-label="Downvote"

                                onClick={() => handleVote(-1)}
                                disabled={votingLoading}
                                className={`px-2 py-1 h-6.5 w-6.5 rounded-tr-md rounded-br-md ${arrowButtonColors(-1)} transition-colors font-bold `} type="button">

                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"
                                  strokeWidth="2.5"></path>
                        </svg>
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
