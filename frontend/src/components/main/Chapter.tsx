import type {Chapter as Ch} from "../../types/kjv.ts";
import VerseDisplay from "./VerseDisplay.tsx";

import CommentsFeed from "./comments/CommentsFeed.tsx";

interface Props {
    chapter: Ch,
    index: number
    id: number,
    className?: string

}

export const Chapter = ({chapter, className}: Props) => {

    return (
        <div className={className + " flex flex-row"}>
          <VerseDisplay className="flex-3" verses={chapter.verses} />
        </div>

    )

}
