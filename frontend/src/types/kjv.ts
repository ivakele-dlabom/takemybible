export  interface Book {
    name: string,
    chapters: Chapter[]

}

export  interface Chapter {
    chapter: number,
    name: string,
    verses: Verse[]
}

export interface Verse {
    verse: string,
    chapter: string,
    name: string,
    text: string
}