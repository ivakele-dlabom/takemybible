import VerseDisplay, { type VerseData } from "./VerseDisplay.tsx";
import type {  Verse } from "@/types/main";


interface Props {
    verses?: Verse[];
    className?: string;
    onVerseSelect?: (verseId: number) => void;
}

export const Chapter = ({ verses, className, onVerseSelect }: Props) => {
  if (!verses) return null;
    return (
        <div className={className + " flex flex-row"}>
            <VerseDisplay className="mt-4 flex-3" verses={verses} onVerseSelect={onVerseSelect} />
        </div>
    );
};
