import {useEffect, useState} from "react";
import {getBookData} from "../../utils/kjv.ts";
import type {Book as Bk} from "../../types/kjv.ts";
import {Book} from "./Book.tsx";

const Main = () => {
  const [books, setBooks] = useState<Bk[]>()

  useEffect(() => {
    function initial() {
       const data = getBookData();
       setBooks(data);
    }
    initial();

  });

  return (
      <section className={"grid grid-cols-1  gap-4 place-items-center min-h-screen"}>
        {books?.map((book) => {
          return (
              <Book className={"w-[50%] "} book={book}/>
          )
        })}
      </section>
  )
}

export default Main
