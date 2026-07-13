import React from "react";
import type {Verse} from "../../types/kjv.ts";


export interface VerseDisplayProps {
  verses: Verse[];
}

const VerseDisplay: React.FC<VerseDisplayProps> = ({ verses }) => {
  return (
    <div className="w-[90%] mx-auto bg-[#fff] font-sans p-6">
      {verses.map((verse, number) => (
        <div
          key={number+1}
          className="relative bg-white pl-10 pr-6 py-6 cursor-pointer transform scale-100 transition-transform duration-200 ease-out hover:scale-[1.03] hover:shadow-lg hover:z-10"
        >
          <span className="absolute top-6 left-3.5 text-sm font-semibold text-[#d43b3b] leading-none">
            {number+1}
          </span>
          <div className="border-none border-[#8a8a8a] px-6 py-4">
            <p className="m-0 text-2xl sm:text-[1.7rem] font-bold leading-snug text-[#161616]">
              {verse.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VerseDisplay;