import React, {createContext, useContext, useState, useCallback, type ReactNode} from "react";
import type {Book} from "../types/main.ts";
import type {Dispatch, SetStateAction} from "react";

export type Version = "KJV" | "NIV";


interface BookNavigationType {
  translation: string,
  bookNumber: number;
  chapterNumber: number;
  books: Book[]
}

interface Value extends BookNavigationType {
  setBookNumber: (book: number) => void;
  setChapterNumber: (chapter: number) => void;
  nextChapter: () => void;
  previousChapter: () => void;
  nextBook: () => void;
  previousBook: () => void;
  reset: () => void;
  setTranslation: (translation: string) => void;
  setBooks: Dispatch<SetStateAction<Book[]>>;
}

const DEFAULT_STATE: BookNavigationType = {
  translation: "KJV",
  bookNumber: 1,
  chapterNumber: 1,
  books: []
};

const BookNavigationContext = createContext<Value | undefined>(undefined);

interface Props {
  children: ReactNode;
  initialBook?: number;
  initialChapter?: number;
  initialTranslation?: Version
}

export const BookNavigationProvider: React.FC<Props> = ({
  children,
  initialBook = DEFAULT_STATE.bookNumber,
  initialChapter = DEFAULT_STATE.chapterNumber,
  initialTranslation = DEFAULT_STATE.translation
}) => {
  const [bookNumber, setBookNumber] = useState<number>(initialBook);
  const [chapterNumber, setChapterNumber] = useState<number>(initialChapter);
  const [translation, setTranslation] = useState<string>(initialTranslation);
  const [books, setBooks] = useState<Book[]>([]);

  const nextChapter = useCallback(() => {
    setChapterNumber((prev) => prev + 1);
  }, []);

  const previousChapter = useCallback(() => {
    setChapterNumber((prev) => Math.max(1, prev - 1));
  }, []);

  const nextBook = useCallback(() => {
    //
    setBookNumber((prev) => prev + 1);
    setChapterNumber(1);
  }, []);

  const previousBook = useCallback(() => {
    setBookNumber((prev) => Math.max(1, prev - 1));
    setChapterNumber(1);
  }, []);

  const reset = useCallback(() => {
    setBookNumber(initialBook);
    setChapterNumber(initialChapter);
    setTranslation(initialTranslation);
  }, [initialBook, initialChapter, initialTranslation]);

  const value: Value = {
    books,
    setBooks,
    bookNumber,
    chapterNumber,
    setBookNumber,
    setChapterNumber,
    nextChapter,
    previousChapter,
    nextBook,
    previousBook,
    reset,
    translation,
    setTranslation,
  };

  return (
    <BookNavigationContext.Provider value={value}>
      {children}
    </BookNavigationContext.Provider>
  );
};

export const useBookNavigation = (): Value => {
  const context = useContext(BookNavigationContext);
  if (context === undefined) {
    throw new Error("useBookNavigation must be used within a BookProgressProvider");
  }
  return context;
};
