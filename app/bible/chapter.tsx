import { router } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from '@/components/Icon'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useBible } from '@/contexts/bible-context'
import { useTheme } from '@/contexts/theme-context'
import { BibleAPI } from '@/services/bible-api'
import type { FavoriteVerse } from '@/types/bible'

export default function ChapterScreen() {
  const { currentBook, currentChapter, isLoading, error, addToFavorites, isFavorite, loadChapter } =
    useBible()
  const { isDark } = useTheme()
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null)

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <ThemedText style={styles.loadingText}>Loading chapter...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    )
  }

  if (error || !currentChapter || !currentBook) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedView style={styles.errorContainer}>
          <ThemedText type="title" style={styles.errorTitle}>
            Error
          </ThemedText>
          <ThemedText style={styles.errorText}>{error || 'Chapter not found'}</ThemedText>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </SafeAreaView>
    )
  }

  const handleVersePress = (verse: number) => {
    setSelectedVerse(selectedVerse === verse ? null : verse)
  }

  const handleAddToFavorites = async (verse: number, text: string) => {
    const reference = `${currentBook.name} ${currentChapter.chapter}:${verse}`
    const favoriteVerse: FavoriteVerse = {
      id: `${currentBook.name}-${currentChapter.chapter}-${verse}`,
      reference,
      text,
      book: currentBook.name,
      chapter: currentChapter.chapter,
      verse,
      addedAt: new Date(),
    }

    try {
      await addToFavorites(favoriteVerse)
      Alert.alert('Success', 'Verse added to favorites!')
    } catch (_error) {
      Alert.alert('Error', 'Failed to add verse to favorites')
    }
  }

  const handlePreviousChapter = async () => {
    if (currentChapter.chapter > 1) {
      await loadChapter(currentBook, currentChapter.chapter - 1)
    } else {
      // Go to previous book's last chapter
      const books = BibleAPI.getBooks()
      const currentBookIndex = books.findIndex((book) => book.name === currentBook.name)
      if (currentBookIndex > 0) {
        const previousBook = books[currentBookIndex - 1]
        await loadChapter(previousBook, previousBook.chapters)
      }
    }
  }

  const handleNextChapter = async () => {
    if (currentChapter.chapter < currentBook.chapters) {
      await loadChapter(currentBook, currentChapter.chapter + 1)
    } else {
      // Go to next book's first chapter
      const books = BibleAPI.getBooks()
      const currentBookIndex = books.findIndex((book) => book.name === currentBook.name)
      if (currentBookIndex < books.length - 1) {
        const nextBook = books[currentBookIndex + 1]
        await loadChapter(nextBook, 1)
      }
    }
  }

  const handleChapterTitlePress = () => {
    router.back()
  }

  const renderVerse = ({ item: verse }: { item: { verse: number; text: string } }) => {
    const isSelected = selectedVerse === verse.verse
    const reference = `${currentBook.name} ${currentChapter.chapter}:${verse.verse}`
    const isFav = isFavorite(reference)

    return (
      <View style={styles.verseContainer}>
        <TouchableOpacity
          style={styles.verseContent}
          onPress={() => handleVersePress(verse.verse)}
          activeOpacity={0.7}
        >
          <View style={styles.verseNumberContainer}>
            <ThemedText style={styles.verseNumber}>{verse.verse}</ThemedText>
          </View>
          <View style={styles.verseTextContainer}>
            <ThemedText style={styles.verseText}>{verse.text}</ThemedText>
          </View>
        </TouchableOpacity>

        {isSelected && (
          <View style={styles.verseActions}>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => handleAddToFavorites(verse.verse, verse.text)}
            >
              <Icon name="favorite" size={20} color={isFav ? '#EF4444' : '#6B7280'} />
              <ThemedText style={styles.favoriteText}>
                {isFav ? 'Remove from Favorites' : 'Add to Favorites'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Icon name="back" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <ThemedText type="title" style={styles.bookTitle}>
              {currentBook.name} {currentChapter.chapter}
            </ThemedText>
          </View>
          <View style={styles.headerRight}>
            <ThemedText style={styles.versionText}>NIV</ThemedText>
          </View>
        </View>

        {/* Chapter Content */}
        <FlatList
          data={currentChapter.verses}
          renderItem={renderVerse}
          keyExtractor={(item) => item.verse.toString()}
          contentContainerStyle={styles.versesList}
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        />

        {/* Bottom Navigation */}
        <View style={[styles.bottomNavigation, { backgroundColor: isDark ? '#000' : '#fff' }]}>
          <TouchableOpacity style={styles.navButton} onPress={handlePreviousChapter}>
            <Icon name="previous" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.chapterTitle} onPress={handleChapterTitlePress}>
            <ThemedText style={styles.chapterTitleText}>
              {currentBook.name} {currentChapter.chapter}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} onPress={handleNextChapter}>
            <Icon name="next" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
          </TouchableOpacity>
        </View>
      </ThemedView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    marginBottom: 16,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  backButtonText: {
    color: '#3b82f6',
    fontWeight: '500',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerRight: {
    width: 60,
    alignItems: 'flex-end',
  },
  versionText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  versesList: {
    padding: 20,
    paddingBottom: 120, // Space for bottom navigation
  },
  verseContainer: {
    marginBottom: 16,
  },
  verseContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  verseNumberContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  verseNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
    lineHeight: 24,
  },
  verseTextContainer: {
    flex: 1,
  },
  verseText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#333',
  },
  verseActions: {
    marginTop: 12,
    marginLeft: 52,
    padding: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  favoriteText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 40, // Extra padding for safe area
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    minHeight: 80,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  navButtonText: {
    fontSize: 20,
    color: '#3b82f6',
    fontWeight: '600',
  },
  chapterTitle: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  chapterTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
})
