
import {Book} from "./Book.tsx";
import {useBookNavigation} from "../../contexts/BookContext.tsx";

const Main = () => {
    const {books, bookNumber} = useBookNavigation();

  return (
      <section className={"grid grid-cols-1  gap-4 place-items-center min-h-screen"}>

          <Book className={" "} book={books[bookNumber]}/>

      </section>
  )
}

export default Main
