import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useBible } from "@/contexts/bible-context";
import { BibleAPI, type BibleBook } from "@/services/bible-api";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

export default function BibleScreen() {
  const [expandedBook, setExpandedBook] = useState<string | null>(null);
  const [testament, setTestament] = useState<"old" | "new" | "all">("all");
  const { loadChapter } = useBible();

  const books =
    testament === "all"
      ? BibleAPI.getBooks()
      : BibleAPI.getBooks().filter((book) => book.testament === testament);

  const handleBookPress = (book: BibleBook) => {
    if (expandedBook === book.name) {
      setExpandedBook(null);
    } else {
      setExpandedBook(book.name);
    }
  };

  const handleChapterPress = async (book: BibleBook, chapter: number) => {
    await loadChapter(book, chapter);
    router.push("/bible/chapter");
  };

  const renderChapterItem = ({ item: chapter }: { item: number }) => (
    <TouchableOpacity
      style={styles.chapterItem}
      onPress={() => {
        const book = books.find((b) => b.name === expandedBook);
        if (book) {
          handleChapterPress(book, chapter);
        }
      }}
    >
      <ThemedText style={styles.chapterText}>{chapter}</ThemedText>
    </TouchableOpacity>
  );

  const renderBookItem = ({ item: book }: { item: BibleBook }) => {
    const isExpanded = expandedBook === book.name;
    const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1);

    return (
      <ThemedView style={styles.bookContainer}>
        <TouchableOpacity
          style={styles.bookItem}
          onPress={() => handleBookPress(book)}
        >
          <ThemedView style={styles.bookInfo}>
            <ThemedText type="defaultSemiBold" style={styles.bookName}>
              {book.name}
            </ThemedText>
            <ThemedText style={styles.bookChapters}>
              {book.chapters} chapters
            </ThemedText>
          </ThemedView>
          <ThemedText style={styles.expandIcon}>
            {isExpanded ? "▼" : "▶"}
          </ThemedText>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.chaptersContainer}>
            <FlatList
              data={chapters}
              renderItem={renderChapterItem}
              keyExtractor={(item) => item.toString()}
              numColumns={4}
              contentContainerStyle={styles.chaptersGrid}
            />
          </View>
        )}
      </ThemedView>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Bible
        </ThemedText>

        <View style={styles.testamentTabs}>
          <TouchableOpacity
            style={[styles.tab, testament === "old" && styles.activeTab]}
            onPress={() => setTestament("old")}
          >
            <ThemedText
              style={[
                styles.tabText,
                testament === "old" && styles.activeTabText,
              ]}
            >
              Old Testament
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, testament === "new" && styles.activeTab]}
            onPress={() => setTestament("new")}
          >
            <ThemedText
              style={[
                styles.tabText,
                testament === "new" && styles.activeTabText,
              ]}
            >
              New Testament
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, testament === "all" && styles.activeTab]}
            onPress={() => setTestament("all")}
          >
            <ThemedText
              style={[
                styles.tabText,
                testament === "all" && styles.activeTabText,
              ]}
            >
              All Books
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>

      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.booksList}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  testamentTabs: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#3b82f6",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
  activeTabText: {
    color: "white",
  },
  booksList: {
    padding: 20,
    paddingTop: 10,
  },
  bookContainer: {
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  bookItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  bookInfo: {
    flex: 1,
  },
  bookName: {
    fontSize: 16,
    marginBottom: 4,
  },
  bookChapters: {
    fontSize: 14,
    opacity: 0.6,
  },
  expandIcon: {
    fontSize: 16,
    opacity: 0.6,
  },
  chaptersContainer: {
    borderTopWidth: 1,
    borderTopColor: "rgba(0, 0, 0, 0.1)",
    padding: 16,
  },
  chaptersGrid: {
    gap: 8,
  },
  chapterItem: {
    flex: 1,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
    margin: 2,
  },
  chapterText: {
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "500",
  },
});
