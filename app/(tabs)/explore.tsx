import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { StyleSheet } from "react-native";

export default function ProgressScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Progress
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Track your Bible learning journey
        </ThemedText>
        <ThemedText style={styles.description}>
          Coming soon features:
        </ThemedText>

        <ThemedView style={styles.featuresList}>
          <ThemedView style={styles.featureItem}>
            <ThemedText style={styles.featureIcon}>📊</ThemedText>
            <ThemedText style={styles.featureText}>
              Reading statistics and streaks
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.featureItem}>
            <ThemedText style={styles.featureIcon}>🏆</ThemedText>
            <ThemedText style={styles.featureText}>
              Achievements and badges
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.featureItem}>
            <ThemedText style={styles.featureIcon}>📈</ThemedText>
            <ThemedText style={styles.featureText}>
              Learning progress tracking
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.featureItem}>
            <ThemedText style={styles.featureIcon}>🎯</ThemedText>
            <ThemedText style={styles.featureText}>
              Personal goals and challenges
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.featureItem}>
            <ThemedText style={styles.featureIcon}>📅</ThemedText>
            <ThemedText style={styles.featureText}>
              Reading plans and schedules
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    textAlign: "center",
    opacity: 0.8,
    marginBottom: 24,
    fontSize: 18,
  },
  description: {
    textAlign: "center",
    opacity: 0.7,
    marginBottom: 32,
    fontSize: 16,
  },
  featuresList: {
    width: "100%",
    maxWidth: 300,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
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
});
