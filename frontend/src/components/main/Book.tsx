import type {Book as Bk} from "../../types/kjv.ts";
import {Chapter} from "./Chapter.tsx";

interface Props {
    className?: string,
    book: Bk,
}
export const Book = ({book, className}: Props) => {
    return (
        <section className={className + ""}>
        <h1>{book.name}</h1>
    {book.chapters.map((chapter) => {
        return (
            <Chapter chapter={chapter}/>
        )
    })}
        </section>
    )
}


