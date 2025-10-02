export interface BibleBook {
  name: string
  chapters: number
  testament: 'old' | 'new'
  abbreviation: string
}

export interface BibleChapter {
  book: string
  chapter: number
  verses: BibleVerse[]
}

export interface BibleVerse {
  verse: number
  text: string
}

export interface BibleSearchResult {
  reference: string
  text: string
  book: string
  chapter: number
  verse: number
}

export interface FavoriteVerse {
  id: string
  reference: string
  text: string
  book: string
  chapter: number
  verse: number
  addedAt: Date
}

export interface BibleAPIResponse {
  reference: string
  text: string
  translation_id: string
  translation_name: string
  translation_note: string
  verses: Array<{
    book_id: string
    book_name: string
    chapter: number
    verse: number
    text: string
  }>
}
