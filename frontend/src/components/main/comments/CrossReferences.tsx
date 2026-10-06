import {useCrossReferences} from "@/hooks/useCrossReferences.ts";
import {useVerseSelection} from "@/contexts/VerseSelectionContext.tsx";
import type {CrossReference} from "@/types/main.ts";
import {useBookNavigation} from "@/contexts/BookContext.tsx";
import {Plus} from "lucide-react";
import {SearchReference} from "@/components/main/comments/SearchReference.tsx";
import {SortReferences} from "@/components/main/comments/SortReferences.tsx";
import {useEffect, useRef, useState} from "react";
import CrossReferenceCard from "@/components/main/comments/CrossReferenceCard.tsx";

export default function CrossReferences() {
    const {selectedVerseNumber} = useVerseSelection();
    const {crossReferences} = useCrossReferences(selectedVerseNumber);
    const {bookNumber, chapterNumber, books} = useBookNavigation();
    const [sortValue, setSortValue] = useState("")
    const bookName = books[bookNumber-1]?.name ?? "";
    const [scrolling, setScrolling] = useState(false);
    const timer = useRef<number | undefined>(undefined);

    const handleScroll = () => {
        // console.log("scrolling: ", scrolling);
        setScrolling(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setScrolling(false), 600);
    };

    useEffect(() => () => window.clearTimeout(timer.current), []);

    return (
       <section  onScroll={handleScroll} className={`p-4 h-130 w-150  overflow-y-auto 
        transition-all
        duration-500
        [&::-webkit-scrollbar]:h-[6px] 
        [&::-webkit-scrollbar]:w-[2px] 
        [&::-webkit-scrollbar-track]:bg-gray-100 
        [&::-webkit-scrollbar-thumb]:bg-gray-400 
        [&.is-scrolling::-webkit-scrollbar]:h-[8px]
        [&.is-scrolling::-webkit-scrollbar]:w-[4px]
        ${scrolling ? "is-scrolling" : ""}
      `}>
          <div className={"flex flex-row justify-between"}>
              <div className={"flex flex-col gap-1 items-start"}>
                  <div className={"flex flex-row gap-2 "}>
                      <span className={"rounded-full bg-amber-500 size-3 my-auto"}></span>
                      <span className={"text-xl font-bold uppercase "}>{`${bookName} ${chapterNumber}: ${selectedVerseNumber}`} cross references</span>
                  </div>
                  <span className={"text-gray-500 text-sm"}>Showing {`${crossReferences.length}`} validated biblical connection</span>
              </div>

              <button className={"flex flex-row gap-2 h-10 rounded-sm border border-gray-300 p-2 hover:cursor-pointer"}>
                  <Plus className={"size-4 my-auto"}/>
                  <span className={"my-auto font-bold"}>Add Ref</span>
              </button>
          </div>
           {/* Search and Sorter*/}
           <div className={"flex flex-row justify-between mt-4"}>
               <SearchReference/>
               <SortReferences setSortValue={setSortValue} sortValue={sortValue} />
           </div>

           <div className="w-full mt-2 h-px bg-gray-300 my-4"></div>
           {crossReferences.map((crossReference: CrossReference, index) => {
               return (
                   <CrossReferenceCard key={index} id={index} reference={crossReference}/>
               )
           })}
       </section>
    )
}