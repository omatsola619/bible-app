import { StyleSheet } from 'react-native'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'

export default function BibleScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Bible
        </ThemedText>
        <ThemedText style={styles.subtitle}>Coming Soon</ThemedText>
        <ThemedText style={styles.description}>
          We're working hard to bring you the complete Bible experience
        </ThemedText>

        <ThemedView style={styles.featuresList}>
          <ThemedView style={styles.featureItem}>
            <ThemedText style={styles.featureIcon}>📖</ThemedText>
            <ThemedText style={styles.featureText}>Read the Bible</ThemedText>
          </ThemedView>
          <ThemedView style={styles.featureItem}>
            <ThemedText style={styles.featureIcon}>🔍</ThemedText>
            <ThemedText style={styles.featureText}>Search scriptures</ThemedText>
          </ThemedView>
          <ThemedView style={styles.featureItem}>
            <ThemedText style={styles.featureIcon}>📝</ThemedText>
            <ThemedText style={styles.featureText}>Take notes and highlights</ThemedText>
          </ThemedView>
          <ThemedView style={styles.featureItem}>
            <ThemedText style={styles.featureIcon}>📚</ThemedText>
            <ThemedText style={styles.featureText}>Multiple translations</ThemedText>
          </ThemedView>
          <ThemedView style={styles.featureItem}>
            <ThemedText style={styles.featureIcon}>⭐</ThemedText>
            <ThemedText style={styles.featureText}>Bookmark favorites</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 24,
    fontSize: 18,
    color: '#3b82f6',
  },
  description: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 32,
    fontSize: 16,
  },
  featuresList: {
    width: '100%',
    maxWidth: 300,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 32,
  },
  featureText: {
    flex: 1,
    opacity: 0.8,
    fontSize: 16,
  },
})
