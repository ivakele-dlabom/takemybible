import type {Chapter as Ch} from "../../types/kjv.ts";
import {Verse} from "./Verse.tsx";

interface Props {
    chapter: Ch
}

export const Chapter = ({chapter}: Props) => {

    return (
        <>
        <h2>{chapter.name}</h2>
            {chapter.verses.map((verse, index) => {
                return (
                    <span className={"flex-col "}>
                        <p className={"text-red-600 w-fit"}>{index+1}</p>
                        <Verse verse={verse}/>
                    </span>
                )
            })}
        </>

    )

}