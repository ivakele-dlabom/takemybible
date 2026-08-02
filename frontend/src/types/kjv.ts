export  interface Book {
    name: string,
    id: number,
    chapters: Chapter[]

}

export  interface Chapter {
    chapter: number,
    id: number,
    name: string,
    verses: Verse[]
}

export interface Verse {
    verse: string,
    chapter: string,
    name: string,
    text: string,
    myComments: number,
    publicComments: number
}