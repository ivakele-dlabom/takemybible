import VerseDisplay from "./VerseDisplay.tsx";
import type {  Verse } from "@/types/main";
import {useVerseSelection} from "@/contexts/VerseSelectionContext.tsx";
import {useEffect, useRef, useState} from "react";


interface Props {
    verses?: Verse[];
    className?: string;
    onVerseSelect?: (verseId: number) => void;
}

export const Chapter = ({ verses, onVerseSelect }: Props) => {
    const {selected} = useVerseSelection();
    const [scrolling, setScrolling] = useState(false);
    const timer = useRef<number | undefined>(undefined);

    const handleScroll = () => {
        setScrolling(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setScrolling(false), 600);
    };

    useEffect(() => () => window.clearTimeout(timer.current), []);
  if (!verses) return null;
    return (
        <div  onScroll={handleScroll} className={`${selected? "w-200 ml-4 ": "w-200"}` + ` h-164  overflow-y-auto 
        transition-all
        duration-500
        [&::-webkit-scrollbar]:h-[6px] 
        [&::-webkit-scrollbar]:w-[2px] 
        [&::-webkit-scrollbar-track]:bg-gray-100 
        [&::-webkit-scrollbar-thumb]:bg-gray-400 
        [&.is-scrolling::-webkit-scrollbar]:h-[8px]
        [&.is-scrolling::-webkit-scrollbar]:w-[4px]
        ${scrolling ? "is-scrolling" : ""}
        flex flex-row`}>
            <VerseDisplay className="mt-4 flex-3" verses={verses} onVerseSelect={onVerseSelect} />
        </div>
    );
};
