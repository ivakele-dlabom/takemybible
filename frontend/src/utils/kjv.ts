// src/utils/readJson.ts
import type { Book } from "../types/kjv";
import jsonData from "../assets/kjv/kjv.json"; // Import directly

type Place = {
    books: Book[],
}

// No async needed - it's already loaded!
export const getBookData = (): Book[] => {
    // If your JSON is an array of books
    const books = jsonData as Place;
    return books.books;
};