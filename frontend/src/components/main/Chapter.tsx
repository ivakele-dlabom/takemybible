import VerseDisplay, { type VerseData } from "./VerseDisplay.tsx";

interface Props {
    verses: VerseData[];
    className?: string;
    onVerseSelect?: (verseId: number) => void;
}

export const Chapter = ({ verses, className, onVerseSelect }: Props) => {
    return (
        <div className={className + " flex flex-row"}>
            <VerseDisplay className="mt-4 flex-3" verses={verses} onVerseSelect={onVerseSelect} />
        </div>
    );
};
