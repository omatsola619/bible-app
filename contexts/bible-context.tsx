import AsyncStorage from '@react-native-async-storage/async-storage'
import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { BibleAPI } from '../services/bible-api'
import type { BibleBook, BibleChapter, FavoriteVerse } from '../types/bible'

interface BibleContextType {
  // Current reading state
  currentBook: BibleBook | null
  currentChapter: BibleChapter | null
  isLoading: boolean
  error: string | null

  // Favorites
  favorites: FavoriteVerse[]

  // Actions
  loadChapter: (book: BibleBook, chapter: number) => Promise<void>
  addToFavorites: (verse: FavoriteVerse) => Promise<void>
  removeFromFavorites: (verseId: string) => Promise<void>
  isFavorite: (reference: string) => boolean
  clearError: () => void
}

const BibleContext = createContext<BibleContextType | undefined>(undefined)

const FAVORITES_STORAGE_KEY = '@biblia2_favorites'

export function BibleProvider({ children }: { children: React.ReactNode }) {
  const [currentBook, setCurrentBook] = useState<BibleBook | null>(null)
  const [currentChapter, setCurrentChapter] = useState<BibleChapter | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<FavoriteVerse[]>([])

  // Load favorites from storage on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY)
        if (storedFavorites) {
          const parsedFavorites = JSON.parse(storedFavorites).map(
            (fav: FavoriteVerse & { addedAt: string }) => ({
              ...fav,
              addedAt: new Date(fav.addedAt),
            })
          )
          setFavorites(parsedFavorites)
        }
      } catch (error) {
        console.error('Error loading favorites:', error)
      }
    }
    loadFavorites()
  }, [])

  const loadChapter = async (book: BibleBook, chapter: number) => {
    setIsLoading(true)
    setError(null)

    try {
      const chapterData = await BibleAPI.getChapter(book.name, chapter)
      setCurrentBook(book)
      setCurrentChapter(chapterData)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load chapter')
    } finally {
      setIsLoading(false)
    }
  }

  const addToFavorites = async (verse: FavoriteVerse) => {
    try {
      const newFavorites = [...favorites, verse]
      setFavorites(newFavorites)
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites))
    } catch (error) {
      console.error('Error adding to favorites:', error)
    }
  }

  const removeFromFavorites = async (verseId: string) => {
    try {
      const newFavorites = favorites.filter((fav) => fav.id !== verseId)
      setFavorites(newFavorites)
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites))
    } catch (error) {
      console.error('Error removing from favorites:', error)
    }
  }

  const isFavorite = (reference: string) => {
    return favorites.some((fav) => fav.reference === reference)
  }

  const clearError = () => {
    setError(null)
  }

  const value: BibleContextType = {
    currentBook,
    currentChapter,
    isLoading,
    error,
    favorites,
    loadChapter,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearError,
  }

  return <BibleContext.Provider value={value}>{children}</BibleContext.Provider>
}

export function useBible() {
  const context = useContext(BibleContext)
  if (context === undefined) {
    throw new Error('useBible must be used within a BibleProvider')
  }
  return context
}
