export const bookKeys = {
  byTranslation: (translation: string) => ["books", translation] as const,
};
export const verseKeys = {
  byBookIdChapterId: (translation: string, bookId: number, chapterId: number) => ["verses", translation, bookId, chapterId] as const,
};

export const chapterKeys = {
  byBookId: (bookId: number) => ["chapters", bookId] as const,
};
