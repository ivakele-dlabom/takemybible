import React, {createContext, useContext, useState, useCallback, type ReactNode} from "react";
import type {Book} from "../types/kjv.ts";
import {getBookData} from "../utils/kjv.ts";

interface BookNavigationState {
  bookNumber: number;
  chapterNumber: number;
  books: Book[]
}

interface BookNavigationContextValue extends BookNavigationState {
  setBookNumber: (book: number) => void;
  setChapterNumber: (chapter: number) => void;
  nextChapter: () => void;
  previousChapter: () => void;
  nextBook: () => void;
  previousBook: () => void;
  reset: () => void;
}

const DEFAULT_STATE: BookNavigationState = {
  bookNumber: 0,
  chapterNumber: 1,
  books: []
};

const BookNavigationContext = createContext<BookNavigationContextValue | undefined>(undefined);

interface BookNavigationProviderProps {
  children: ReactNode;
  initialBook?: number;
  initialChapter?: number;
}

export const BookNavigationProvider: React.FC<BookNavigationProviderProps> = ({
  children,
  initialBook = DEFAULT_STATE.bookNumber,
  initialChapter = DEFAULT_STATE.chapterNumber,
}) => {
  const [bookNumber, setBookNumberState] = useState<number>(initialBook);
  const [chapterNumber, setChapterNumberState] = useState<number>(initialChapter);
  const books = getBookData();


  const setBookNumber = useCallback((book: number) => {
    setBookNumberState(book);
  }, []);

  const setChapterNumber = useCallback((chapter: number) => {
    setChapterNumberState(chapter);
  }, []);

  const nextChapter = useCallback(() => {
    setChapterNumberState((prev) => prev + 1);
  }, []);

  const previousChapter = useCallback(() => {
    setChapterNumberState((prev) => Math.max(1, prev - 1));
  }, []);

  const nextBook = useCallback(() => {
    setBookNumberState((prev) => prev + 1);
    setChapterNumberState(1);
  }, []);

  const previousBook = useCallback(() => {
    setBookNumberState((prev) => Math.max(1, prev - 1));
    setChapterNumberState(1);
  }, []);

  const reset = useCallback(() => {
    setBookNumberState(initialBook);
    setChapterNumberState(initialChapter);
  }, [initialBook, initialChapter]);

  const value: BookNavigationContextValue = {
    books,
    bookNumber,
    chapterNumber,
    setBookNumber,
    setChapterNumber,
    nextChapter,
    previousChapter,
    nextBook,
    previousBook,
    reset,
  };

  return (
    <BookNavigationContext.Provider value={value}>
      {children}
    </BookNavigationContext.Provider>
  );
};

export const useBookNavigation = (): BookNavigationContextValue => {
  const context = useContext(BookNavigationContext);
  if (context === undefined) {
    throw new Error("useBookNavigation must be used within a BookProgressProvider");
  }
  return context;
};