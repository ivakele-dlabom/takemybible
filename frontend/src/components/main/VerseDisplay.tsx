import React, { useState } from "react";
import type { Verse } from "@/types/main";
import {useVerseSelection} from "@/contexts/VerseSelectionContext.tsx";


export interface VerseData {
    id: number;
    verseNumber: number;
    text: string;
    commentCount: number;
}

export interface VerseDisplayProps {
    verses: Verse[];
    className?: string;
    onVerseSelect?: (verseId: number) => void;
}

const VerseDisplay: React.FC<VerseDisplayProps> = ({ verses, className, onVerseSelect }) => {
    const [focusedVerse, setFocusedVerse] = useState<number>(-1);
    const {selected, setSelectedVerseNumber} = useVerseSelection();

    const handleSelectVerse = (index: number, verseId: number) => {
        setFocusedVerse(index);
        onVerseSelect?.(verseId);
        setSelectedVerseNumber(index + 1);
    };

    const focusedVerseStyles = (styles: string, num: number): string => {
        return focusedVerse === num ? styles : "";
    };

    return (
        <div className={className + " flex-col bg-white font-sans p-6 space-y-8"}>
            {verses.map((verse, index) => (
                <div className="" key={verse.id}>
                    <div
                        id={index.toString()}
                        onClick={(e) => {
                            e.currentTarget.scrollIntoView({ behavior: "smooth", block: "start" });
                            handleSelectVerse(index, verse.id);
                        }}
                        className="relative mb-2 group scroll-mt-38"
                    >
                        <div
                            className={
                                "relative bg-white rounded-xs text-left cursor-pointer transform scale-100 transition-transform duration-200 ease-out hover:scale-[1.02]  hover:z-10 " +
                                focusedVerseStyles(" ring-1 ring-neutral-200 mb-50", index)
                            }
                        >
                            <span className="absolute left-0 text-sm font-fira font-semibold text-[#d43b3b] leading-none">
                                {verse.verse}
                            </span>
                            <div className="border-none ">
                                <p className={`${selected? "text-xl": "text-xs"}` + " m-0 font-fira font-semibold leading-snug selection:bg-yellow-200 selection:text-black pl-4 text-[#161616] " + focusedVerseStyles(" text-3xl", index)}>
                                    {verse.text}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default VerseDisplay;
