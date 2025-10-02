import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useBible } from "@/contexts/bible-context";
import type { FavoriteVerse } from "@/types/bible";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChapterScreen() {
  const {
    currentBook,
    currentChapter,
    isLoading,
    error,
    addToFavorites,
    isFavorite,
  } = useBible();
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <ThemedText style={styles.loadingText}>Loading chapter...</ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (error || !currentChapter) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <ThemedView style={styles.errorContainer}>
          <ThemedText type="title" style={styles.errorTitle}>
            Error
          </ThemedText>
          <ThemedText style={styles.errorText}>
            {error || "Chapter not found"}
          </ThemedText>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </SafeAreaView>
    );
  }

  const handleVersePress = (verse: number) => {
    setSelectedVerse(selectedVerse === verse ? null : verse);
  };

  const handleAddToFavorites = async (verse: number, text: string) => {
    const reference = `${currentBook?.name} ${currentChapter.chapter}:${verse}`;
    const favoriteVerse: FavoriteVerse = {
      id: `${currentBook?.name}-${currentChapter.chapter}-${verse}`,
      reference,
      text,
      book: currentBook?.name || "",
      chapter: currentChapter.chapter,
      verse,
      addedAt: new Date(),
    };

    try {
      await addToFavorites(favoriteVerse);
      Alert.alert("Success", "Verse added to favorites!");
    } catch (_error) {
      Alert.alert("Error", "Failed to add verse to favorites");
    }
  };

  const renderVerse = ({
    item: verse,
  }: {
    item: { verse: number; text: string };
  }) => {
    const isSelected = selectedVerse === verse.verse;
    const reference = `${currentBook?.name} ${currentChapter.chapter}:${verse.verse}`;
    const isFav = isFavorite(reference);

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
              <ThemedText style={styles.favoriteIcon}>
                {isFav ? "❤️" : "🤍"}
              </ThemedText>
              <ThemedText style={styles.favoriteText}>
                {isFav ? "Remove from Favorites" : "Add to Favorites"}
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ThemedView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ThemedText style={styles.backButtonText}>← Back</ThemedText>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <ThemedText type="title" style={styles.bookTitle}>
              {currentBook?.name}
            </ThemedText>
            <ThemedText style={styles.chapterNumber}>
              {currentChapter.chapter}
            </ThemedText>
          </View>
          <View style={styles.headerRight} />
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
      </ThemedView>
    </SafeAreaView>
  );
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    marginBottom: 16,
  },
  errorText: {
    textAlign: "center",
    marginBottom: 24,
    opacity: 0.7,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  },
  backButtonText: {
    color: "#3b82f6",
    fontWeight: "500",
    fontSize: 16,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  bookTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  chapterNumber: {
    fontSize: 24,
    fontWeight: "600",
    color: "#3b82f6",
  },
  headerRight: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  versesList: {
    padding: 20,
  },
  verseContainer: {
    marginBottom: 16,
  },
  verseContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  verseNumberContainer: {
    width: 40,
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  verseNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3b82f6",
    lineHeight: 24,
  },
  verseTextContainer: {
    flex: 1,
  },
  verseText: {
    fontSize: 18,
    lineHeight: 28,
    color: "#333",
  },
  verseActions: {
    marginTop: 12,
    marginLeft: 52,
    padding: 12,
    backgroundColor: "rgba(59, 130, 246, 0.05)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
  },
  favoriteButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  favoriteIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  favoriteText: {
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "500",
  },
});
