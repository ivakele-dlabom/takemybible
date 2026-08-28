export interface Verse {
  id: number;
  book_id: number;
  chapter: number;
  verse: number;
  text: string;
}


export interface Book {
  id: number;
  name: string;


}

export interface CrossReference {
  id: number;
  from_book: string;
  from_chapter: number;
  from_verse: number;
  to_book: string;
  to_chapter: number;
  to_verse_start: number;
  to_verse_end: number;
  votes: number;
  to_verse: number;
}
