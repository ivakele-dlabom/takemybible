import React, { useState } from "react";
import type { Verse } from "@/types/main";


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

    const handleSelectVerse = (index: number, verseId: number) => {
        setFocusedVerse(index);
        onVerseSelect?.(verseId);
    };

    const focusedVerseStyles = (styles: string, num: number): string => {
        return focusedVerse === num ? styles : "";
    };

    return (
        <div className={className + " flex-col w-[80%] mx-auto bg-white font-sans p-6 space-y-8"}>
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
                                focusedVerseStyles(" ring-1 ring-neutral-200", index)
                            }
                        >
                            <span className="absolute left-0 text-sm font-semibold text-[#d43b3b] leading-none">
                                {verse.id}
                            </span>
                            <div className="border-none ">
                                <p className="m-0 pl-4 text-lg sm:text-[1.7rem] font-medium leading-snug text-[#161616]">
                                    {verse.text}
                                </p>
                            </div>
                            {/*{verse.commentCount > 0 && (
                                <span className="absolute top-6 right-4 text-xs text-neutral-400">
                                    {verse.commentCount} {verse.commentCount === 1 ? "comment" : "comments"}
                                </span>
                            )}*/}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default VerseDisplay;
