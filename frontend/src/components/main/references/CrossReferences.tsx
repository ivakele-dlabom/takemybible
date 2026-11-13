import {useCrossReferences} from "@/hooks/useCrossReferences.ts";
import {useVerseSelection} from "@/contexts/VerseSelectionContext.tsx";
import type {CrossReference} from "@/types/main.ts";
import {useBookNavigation} from "@/contexts/BookContext.tsx";
import {Plus} from "lucide-react";
import {SearchReference} from "@/components/main/references/SearchReference.tsx";
import {SortReferences} from "@/components/main/references/SortReferences.tsx";
import {useEffect, useRef, useState} from "react";
import CrossReferenceCard from "@/components/main/references/CrossReferenceCard.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { fromNumericToRoman } from "@/lib/utils";
import {toast} from "@/components/ui/toast.tsx"
import AddCrossReferenceModal, {type SourceVerse} from "@/components/main/references/AddCrossReferenceModal.tsx";
import {useModal} from "@/contexts/ModalContext.tsx";
import {useVerses} from "@/hooks/useVerse.ts";

export default function CrossReferences() {
    const navigate = useNavigate();
    const {selectedVerseNumber, setSelectedVerseNumber, setSelectedVerseId} = useVerseSelection();
    const {crossReferences, fetchCrossReferences} = useCrossReferences(selectedVerseNumber);
    const { books, translation} = useBookNavigation();
    const {crossReferenceModalOpen, setCrossReferenceModalOpen} = useModal();
    const { bookNumber, chapterNumber } = useParams<{ bookNumber: string; chapterNumber: string; verseNumber: string }>();
    const [sortValue, setSortValue] = useState("")
    const bookName = books[Number(bookNumber ?? 1)-1]?.name ?? "";
    const timer = useRef<number | undefined>(undefined);
    const {data: verse} = useVerses();

    const addReferenceSource:SourceVerse  ={
        bookName: bookName,
        chapterNumber: Number(chapterNumber),
        verseNumber: selectedVerseNumber,
        text: verse?.[selectedVerseNumber-1]?.text || "Verse not available",
}


    const onOpenReference = (bookName: string, chN: number, vN: number) => {
        books.map((b) => console.log(b.name));
        const bkN = books.findIndex(
            (book) => {
                const romanBookName = fromNumericToRoman(bookName);
                return book.name.trim().toLowerCase() === romanBookName.trim().toLowerCase();
            }
        );

        if (bkN === -1) {
            toast.add({ type: "error", description: `Couldn't find book: ${bookName}`, priority: "low" });
            return;
        }

        const bookNum = bkN + 1;

        setSelectedVerseNumber(vN);
        setSelectedVerseId(vN);
        navigate(`/${translation}/${bookNum}/${chN}/${vN}`);
    };


    useEffect(() => () => window.clearTimeout(timer.current), []);

    function handleAddReference() {
        setCrossReferenceModalOpen(true);
    }

    return (
       <section  className={`p-4 h-130 w-140 font-geist  overflow-y-auto 
        transition-all
        duration-500
        [&::-webkit-scrollbar]:h-[6px] 
        [&::-webkit-scrollbar]:w-[2px] 
        [&::-webkit-scrollbar-track]:bg-gray-100 
        [&::-webkit-scrollbar-thumb]:bg-gray-400 
       
      `}>
          <div className={"flex flex-row justify-between"}>
              <div className={"flex flex-col gap-1 items-start"}>
                  <div className={"flex flex-row gap-2 "}>
                      <span className={"rounded-full bg-amber-500 size-3 my-auto"}></span>
                      <span className={"text-md font-bold uppercase font-geist"}>{`${bookName} ${chapterNumber}: ${selectedVerseNumber}`} cross references</span>
                  </div>
                  <span className={"text-gray-500 font-geist-mono text-xs"}>Showing {`${crossReferences.length}`} validated biblical connection</span>
              </div>

              <button
                  onClick={handleAddReference}
                  className={"flex flex-row gap-2 h-8 bg-black text-white rounded-sm border border-gray-300 p-2 hover:cursor-pointer"}>
                  <Plus className={"size-4 my-auto"}/>
                  <span className={"my-auto font-bold text-xs"}>Add Ref</span>
              </button>
          </div>
           {/* Search and Sorter*/}
           <div className={"flex flex-row justify-between mt-4 h-8"}>
               <SearchReference/>
               <SortReferences setSortValue={setSortValue} sortValue={sortValue} />
           </div>

           <div className="w-full mt-2 h-px bg-gray-300 my-4"></div>
           {crossReferences.map((crossReference: CrossReference, index) => {
               return (
                   <CrossReferenceCard onOpenReference={onOpenReference} key={index} id={index} reference={crossReference}/>
               )
           })}
           <AddCrossReferenceModal isOpen={crossReferenceModalOpen}
                                   source={addReferenceSource} refetchCrossReferences={fetchCrossReferences}/>
       </section>
    )
}
