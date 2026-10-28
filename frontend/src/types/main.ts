export interface Verse {
  id: number;
  book_id: number;
  chapter: number;
  verse: number;
  text: string;
}

export interface CrossReferenceVote {
  userId: string;
  crossReferenceId: string;
  value: number;
}

export interface Citation {
    bookNumber: number;
    chapterNumber: number;
    verseNumber: number;
}

export interface Book {
  id: number;
  name: string;
}

export interface CrossReference {
  id: number;
  fromBook: string;
  fromChapter: number;
  fromVerse: number;
  toBook: string;
  toChapter: number;
  toVerseStart: number;
  toVerseEnd: number;
  votes: number;
  toVerse: number;
  userVote: 0 | 1 | -1;
}
