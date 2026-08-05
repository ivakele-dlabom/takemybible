import type {Book as Bk} from "../../types/kjv.ts";
import {Chapter} from "./Chapter.tsx";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem
} from "../ui/dropdown-menu";
import { Button } from "../ui/button.tsx";
import {ChevronDown} from "lucide-react";
import {useBookNavigation} from "../../contexts/BookContext.tsx";
import CommentsFeed from "@/components/main/comments/CommentsFeed.tsx";




interface Props {
    className?: string,
    book: Bk,
}
export const Book = ({ className}: Props) => {
    const {books, setChapterNumber, bookNumber, chapterNumber, setBookNumber} = useBookNavigation();
    const book = books[bookNumber];

    const chapters = books[bookNumber].chapters;

    const handleChapterSelection = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const selectedChapterIndex =Number.parseInt(e.currentTarget.id) ;
        setChapterNumber(selectedChapterIndex);

    }

    const handleSelectedBook = (e:  React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const selectedBookIndex =Number.parseInt(e.currentTarget.id) ;
        setBookNumber(selectedBookIndex);
        setChapterNumber(0);


    }
    return (
      <section className={className + "flex-col mt-4"}>
        <section className={"sticky top-0 z-20 flex flex-col gap-2 bg-white"}>

          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="outline" className="h-12 flex-row font-bold text-4xl">
                <span className="pb-3 pl-6 pr-3 fill-gray-500">{books[bookNumber].name}</span>
                <ChevronDown className="size-6"/>
              </Button>} />
            <DropdownMenuContent className="w-55 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100 overflow-y-auto h-60" align="start">
              {books.map((b, index) => {
                return (
                  <DropdownMenuGroup >
                    <DropdownMenuItem  >
                      <button className={"w-full"} id={"" + index} key={index} onClick={handleSelectedBook}>{b.name}</button>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                )
              })}

            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <Button variant="outline" className="h-10 flex-row font-bold text-2xl">
                <span className="pb-3 pl-6 pr-3 fill-gray-500 outline-none">{"Chapter: " + (chapterNumber + 1)}</span>
                <ChevronDown className="size-6"/>
              </Button>} />
            <DropdownMenuContent className="w-55 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100 overflow-y-auto h-60" align="start">
              {chapters.map((_, index) => {
                return (
                  <DropdownMenuGroup >
                    <DropdownMenuItem  >
                      <button className={"w-full"} id={"" + index} key={index} onClick={handleChapterSelection}>{"Chapter: " + (index+1)}</button>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                )
              })}

            </DropdownMenuContent>
          </DropdownMenu>
        </section>

        <section className="flex flex-row gap-4">
          <Chapter className="h-164 overflow-y-auto scrollbar-thin scrollbar-w-6 scrollbar-thumb-emerald-500 scrollbar-track-gray-100" id={chapterNumber} chapter={book.chapters[chapterNumber]} index={chapterNumber+1}/>

          <CommentsFeed className="" />
        </section>
      </section>

    )
}
