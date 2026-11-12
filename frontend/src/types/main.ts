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

export const ConnectionTypes = new Map<string, string>([
  ["cross_reference", "Another passage discussing the same subject or event."],
  ["prophecy", "A prophecy predicting a future event."],
  ["fulfillment", "An Old Testament promise or prophecy fulfilled in the New Testament."],
  ["quotation", "A passage directly quoted by another passage."],
  ["allusion", "An indirect reference to another passage."],
  ["typology", "An Old Testament person, event, or object foreshadowing something in the New Testament."],
  ["parallel_passage", "Different accounts describing the same event or teaching."],
  ["thematic_connection", "Passages sharing a common subject or theme."],
  ["genealogical_connection", "Passages connected through family lineage or ancestry."],
  ["historical_connection", "Passages referring to the same historical event or period."],
  ["doctrinal_connection", "Passages explaining or supporting the same theological doctrine."],
  ["contrast", "Passages presenting opposing ideas, teachings, or behaviours."],
  ["promise", "A divine promise referenced or reaffirmed in another passage."],
  ["symbolism", "Passages sharing symbolic objects, imagery, or representations."]
]);
