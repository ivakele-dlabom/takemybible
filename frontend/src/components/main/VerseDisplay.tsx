import React, {useState} from "react";
import type {Verse} from "../../types/kjv.ts";
import {VerseContainer} from "./VerseContainer.tsx";

export interface VerseDisplayProps {
  verses: Verse[];
}

const VerseDisplay: React.FC<VerseDisplayProps> = ({ verses }) => {
    const [focusedVerse, setFocusedVerse] = useState<number>(-1)
    const handleSelectVerse = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    const id = target.id;
    setFocusedVerse(Number.parseInt(id));

  };
  return (
      <div className="w-[90%] mx-auto bg-white font-sans p-6 space-y-8">
        {verses.map((verse, number) => (
            <VerseContainer key={number}>
              <div key={number} id={number.toString()}  onClick={handleSelectVerse} className="relative mb-4 group">
                <div
                    className="relative bg-white rounded-md shadow-md pl-10 pr-6 py-6 cursor-pointer transform scale-100 transition-transform duration-200 ease-out hover:scale-[1.02] hover:shadow-lg hover:z-10"
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
                <div className={"absolute -bottom-9 left-6 flex gap-2 z-20 opacity-0 translate-y-1 pointer-events-none transition-all duration-500 ease-out group-hover:opacity-100 hover:opacity-100 group-hover:translate-y-0 hover:translate-y-0 group-hover:pointer-events-auto hover:pointer-events-auto" + (focusedVerse>0? focusedVerse == number? " translate-y-0 opacity-100 pointer-events-auto": "": "")}>
                  <button className="bg-white border border-[#c7dfc9] text-[#3f7d4f] text-sm font-medium rounded-full pl-3 pr-1.5 py-1 flex items-center gap-1.5 shadow-sm">
                    You comments
                    <span className="bg-[#eef6ef] text-[#3f7d4f] rounded-full px-2 py-0.5 text-[11px]">
          {verse.myComments ?? 0}
        </span>
                  </button>
                  <button className="bg-white border border-[#e6dfa8] text-[#8a7d1f] text-sm font-medium rounded-full pl-3 pr-1.5 py-1 flex items-center gap-1.5 shadow-sm">
                    Public comments
                    <span className="bg-[#faf7e0] text-[#8a7d1f] rounded-full px-2 py-0.5 text-[11px]">
          {verse.publicComments ?? 0}
        </span>
                  </button>
                </div>
              </div>
            </VerseContainer>
        ))}
      </div>
  );
};

export default VerseDisplay;