import type {Chapter as Ch} from "../../types/kjv.ts";
import VerseDisplay from "./VerseDisplay.tsx";

interface Props {
    chapter: Ch,
    index: number
    id: number,

}

export const Chapter = ({chapter}: Props) => {


    return (
        <>

            <VerseDisplay verses={chapter.verses}/>
        </>

    )

}