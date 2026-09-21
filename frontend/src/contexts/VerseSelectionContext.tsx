import {createContext, type Dispatch, type SetStateAction, useContext, useState} from "react";

interface VerseSelectionType {
    selected: boolean;
    setSelected: (selected: boolean) => void;
    selectedVerseId: number;
    setSelectedVerseId: Dispatch<SetStateAction<number>>;
    selectedVerseNumber: number;
    setSelectedVerseNumber: Dispatch<SetStateAction<number>>;
}
const VerseSelectionContext = createContext<VerseSelectionType | null>(null);


export function VerseSelectionProvider({ children }: { children: React.ReactNode }) {
    const [selected, setSelected] = useState(true);
    const [selectedVerseId, setSelectedVerseId] = useState<number>(1);
    const [selectedVerseNumber, setSelectedVerseNumber] = useState<number>(1);

    return (
        <VerseSelectionContext.Provider
            value={{selected, setSelected,selectedVerseId, setSelectedVerseId, selectedVerseNumber, setSelectedVerseNumber}}
        >
            {children}
        </VerseSelectionContext.Provider>
    );
}

export function useVerseSelection(): VerseSelectionType {
    const context = useContext(VerseSelectionContext);
    if (!context) {
        throw new Error("useVerseSelection must be used within an VerseSelectionContext");
    }
    return context;
}

