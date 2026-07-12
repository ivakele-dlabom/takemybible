import type {Verse as Vs} from "../../types/kjv.ts";

interface Props {
    verse: Vs
}
export const Verse = ({verse}: Props) => {
    return (
        <p>{verse.text}</p>
    )
}
