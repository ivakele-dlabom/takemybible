import React, {useState} from "react";
import type {Verse} from "../../types/kjv.ts";
import {VerseContainer} from "./VerseContainer.tsx";

export interface VerseDisplayProps {
    verses: Verse[];
    className?: string;
}

const VerseDisplay: React.FC<VerseDisplayProps> = ({ verses, className }) => {
    const [focusedVerse, setFocusedVerse] = useState<number>(1)
    const handleSelectVerse = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        const id = target.id;
        setFocusedVerse(Number.parseInt(id));
        console.log(id)

    };
    const focusedVerseAnimationStyles = (styles: string, num: number): string => {
        if (focusedVerse>=0) {
            if (focusedVerse==num) {
                return styles;
            }
        }
        return "";

    }
    return (
        <div className={className + " flex-col w-[80%] mx-auto bg-white font-sans p-6 space-y-8"}>
            {verses.map((verse, number) => (
              <VerseContainer className="" key={number}>
                <div key={number} id={number.toString()}  onClick={handleSelectVerse} className="relative mb-2 group scroll-mt-38">
                  <div
                    className={" relative bg-white rounded-xs pl-10 pr-6 py-6 cursor-pointer transform scale-100 transition-transform duration-200 ease-out hover:scale-[1.02] hover:shadow-sm hover:z-10 " + focusedVerseAnimationStyles("shadow-sm", number)}
                  >
                    <span className="absolute top-6 left-3.5 text-sm font-semibold text-[#d43b3b] leading-none">
                      {number + 1}
                    </span>
                    <div className="border-none px-6 py-4">
                      <p className="m-0 text-2xl sm:text-[1.7rem] font-bold leading-snug text-[#161616]">
                        {verse.text}
                      </p>
                    </div>
                        </div>
                    </div>


                </VerseContainer>
            ))}

        </div>
    );
};

export default VerseDisplay;
