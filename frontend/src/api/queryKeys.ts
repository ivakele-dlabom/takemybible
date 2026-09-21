export const bookKeys = {
  byTranslation: (translation: string) => ["books", translation] as const,
};
export const verseKeys = {
  byBookIdChapterId: (translation: string, bookId: number, chapterId: number) => ["verses", translation, bookId, chapterId] as const,
};

export const chapterKeys = {
  byBookId: (bookId: number) => ["chapters", bookId] as const,
};


export const crossReferenceKeys = {
  all: ["cross-references"] as const,
  byTranslation: (translation: string) =>
      [...crossReferenceKeys.all, translation] as const,
  byBook: (translation: string, bookName: string) =>
      [...crossReferenceKeys.byTranslation(translation), bookName] as const,
  byChapter: (translation: string, bookName: string, chapterNumber: number) =>
      [...crossReferenceKeys.byBook(translation, bookName), chapterNumber] as const,
  byVerse: (
      translation: string,
      booKName: string,
      chapterNumber: number,
      verse: number
  ) =>
      [...crossReferenceKeys.byChapter(translation, booKName, chapterNumber), verse] as const,
};


