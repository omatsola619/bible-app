import { router } from 'expo-router'
import { useState } from 'react'
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useBible } from '@/contexts/bible-context'
import { BibleAPI } from '@/services/bible-api'
import type { BibleBook } from '@/types/bible'

export default function BibleScreen() {
  const [expandedBook, setExpandedBook] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { loadChapter } = useBible()

  const books = BibleAPI.getBooks()

  const filteredBooks = books.filter((book) =>
    book.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleBookPress = (book: BibleBook) => {
    if (expandedBook === book.name) {
      setExpandedBook(null)
    } else {
      setExpandedBook(book.name)
    }
  }

  const handleChapterPress = async (book: BibleBook, chapter: number) => {
    await loadChapter(book, chapter)
    router.push('/bible/chapter')
  }

  const renderChapterItem = ({ item: chapter }: { item: number }) => {
    const book = books.find((b) => b.name === expandedBook)
    if (!book) {
      return null
    }

    return (
      <TouchableOpacity
        style={styles.chapterItem}
        onPress={() => handleChapterPress(book, chapter)}
      >
        <ThemedText style={styles.chapterText}>{chapter}</ThemedText>
      </TouchableOpacity>
    )
  }

  const renderBookItem = ({ item: book }: { item: BibleBook }) => {
    const isExpanded = expandedBook === book.name
    const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1)

    return (
      <ThemedView style={styles.bookContainer}>
        <TouchableOpacity style={styles.bookItem} onPress={() => handleBookPress(book)}>
          <ThemedView style={styles.bookInfo}>
            <ThemedText type="defaultSemiBold" style={styles.bookName}>
              {book.name}
            </ThemedText>
          </ThemedView>
          <ThemedText style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</ThemedText>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.chaptersContainer}>
            <FlatList
              data={chapters}
              renderItem={renderChapterItem}
              keyExtractor={(item) => item.toString()}
              numColumns={5}
              contentContainerStyle={styles.chaptersGrid}
              scrollEnabled={false}
            />
          </View>
        )}
      </ThemedView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <ThemedText style={styles.searchIcon}>🔍</ThemedText>
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Books List */}
        <FlatList
          data={filteredBooks}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.booksList}
          showsVerticalScrollIndicator={false}
        />
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
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 12,
    opacity: 0.6,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  booksList: {
    paddingBottom: 0,
  },
  bookContainer: {
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  bookInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bookName: {
    fontSize: 18,
  },
  expandIcon: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  chaptersContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    padding: 16,
  },
  chaptersGrid: {
    alignItems: 'flex-start',
  },
  chapterItem: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 8,
    margin: '1%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chapterText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
})
