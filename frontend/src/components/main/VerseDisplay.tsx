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
        <div className="w-[90%] mx-auto bg-white font-sans p-6 space-y-8">
            {verses.map((verse, number) => (
                <VerseContainer key={number}>
                    <div key={number} id={number.toString()}  onClick={handleSelectVerse} className="relative mb-2 group">
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
                        <section className={" max-h-0 opacity-0 overflow-hidden transition-all duration-200 ease-out group-hover:max-h-60 group-hover:opacity-100" }>

                        {/* Connector lines */}
                        <div className={"relative display-none h-8 opacity-0 transition-all duration-500 ease-out group-hover:h-8 group-hover:opacity-100 group-hover:translate-y-0  group-hover:pointer-events-auto " + focusedVerseAnimationStyles( "translate-y-0 opacity-100 pointer-events-auto", number)}>
                            {/* elbow line -> "You comments" (drops then curves left) */}
                            <div className={"absolute top-0 left-2 w-6 h-0 group-hover:h-13 border-l-[1.5px] border-b-[1.5px] border-[#161616] rounded-bl-lg transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0  group-hover:pointer-events-auto" + focusedVerseAnimationStyles( " translate-y-0 opacity-100 pointer-events-auto h-13", number) }/>
                            {/* straight line -> "Public comments" */}
                            <div className={"absolute top-0 left-71 w-[1.5px] h-0 group-hover:h-11 bg-[#161616] transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0  group-hover:pointer-events-auto " + focusedVerseAnimationStyles( " translate-y-0 opacity-100 pointer-events-auto h-11", number)} />
                        </div>

                        <div className={"absolute -bottom-9 left-6 flex gap-2 z-20 opacity-0 translate-y-1 pointer-events-none transition-all duration-500 ease-out group-hover:opacity-100 hover:opacity-100 group-hover:translate-y-0 hover:translate-y-0 group-hover:pointer-events-auto hover:pointer-events-auto" + focusedVerseAnimationStyles( " translate-y-0 opacity-100 pointer-events-auto", number) }>
                            <button className="bg-white border border-black text-black text-sm font-medium  pl-3 pr-1.5 py-1 flex items-center gap-1.5 shadow-sm">
                                You comments
                                <span className="bg-grey text-black rounded-full px-2 py-0.5 text-[11px]">
                                  {verse.myComments ?? 0}
                                </span>
                            </button>
                            <button className="bg-white border border-black text-black text-sm font-medium pl-3 pr-1.5 py-1 flex items-center ml-6 gap-1.5 shadow-sm">
                                Public comments
                                <span className="bg-grey text-black rounded-full px-2 py-0.5 text-[11px]">
                                  {verse.publicComments ?? 0}
                                </span>
                            </button>
                        </div>
                        </section>

                    </div>
                </VerseContainer>
            ))}
        </div>
    );
};

export default VerseDisplay;