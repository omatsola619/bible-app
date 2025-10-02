import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/contexts/theme-context";
import {
  Alert,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { themeMode, setThemeMode, isDark } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            // The navigation will be handled by the root layout based on auth state
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to sign out. Please try again.");
          }
        },
      },
    ]);
  };

  const themeOptions = [
    {
      value: "light" as const,
      label: "Light",
      description: "Always use light theme",
    },
    {
      value: "dark" as const,
      label: "Dark",
      description: "Always use dark theme",
    },
    {
      value: "system" as const,
      label: "System",
      description: "Follow system setting",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Profile</ThemedText>
          <ThemedText style={styles.subtitle}>
            Manage your account and preferences
          </ThemedText>
        </ThemedView>

        {/* User Profile Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Account
          </ThemedText>

          <ThemedView style={styles.profileSection}>
            <View style={styles.profileInfo}>
              <View style={styles.avatar}>
                <ThemedText style={styles.avatarText}>
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </ThemedText>
              </View>
              <View style={styles.profileDetails}>
                <ThemedText type="defaultSemiBold">
                  {user?.name || "User"}
                </ThemedText>
                <ThemedText style={styles.profileEmail}>
                  {user?.email || "user@example.com"}
                </ThemedText>
              </View>
            </View>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <ThemedText style={styles.logoutButtonText}>Sign Out</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Appearance
          </ThemedText>

          <ThemedView style={styles.themeSection}>
            <ThemedView style={styles.themeHeader}>
              <ThemedText type="defaultSemiBold">Theme</ThemedText>
              <ThemedText style={styles.currentTheme}>
                {themeMode === "system"
                  ? "System"
                  : themeMode === "dark"
                  ? "Dark"
                  : "Light"}
              </ThemedText>
            </ThemedView>

            <ThemedText style={styles.themeDescription}>
              Choose how the app should look
            </ThemedText>

            <ThemedView style={styles.themeOptions}>
              {themeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.themeOption,
                    themeMode === option.value && styles.themeOptionSelected,
                  ]}
                  onPress={() => setThemeMode(option.value)}
                >
                  <ThemedView style={styles.themeOptionContent}>
                    <ThemedView style={styles.themeOptionLeft}>
                      <ThemedText type="defaultSemiBold">
                        {option.label}
                      </ThemedText>
                      <ThemedText style={styles.themeOptionDescription}>
                        {option.description}
                      </ThemedText>
                    </ThemedView>

                    <View style={styles.radioContainer}>
                      <View
                        style={[
                          styles.radio,
                          themeMode === option.value && styles.radioSelected,
                        ]}
                      >
                        {themeMode === option.value && (
                          <View style={styles.radioInner} />
                        )}
                      </View>
                    </View>
                  </ThemedView>
                </TouchableOpacity>
              ))}
            </ThemedView>
          </ThemedView>

          {/* Quick Toggle for Light/Dark */}
          <ThemedView style={styles.quickToggleSection}>
            <ThemedView style={styles.quickToggleHeader}>
              <ThemedText type="defaultSemiBold">Quick Toggle</ThemedText>
              <ThemedText style={styles.quickToggleDescription}>
                Toggle between light and dark mode
              </ThemedText>
            </ThemedView>

            <View style={styles.switchContainer}>
              <Switch
                value={isDark}
                onValueChange={(value) =>
                  setThemeMode(value ? "dark" : "light")
                }
                trackColor={{
                  false: "#e5e7eb",
                  true: "#3b82f6",
                }}
                thumbColor={isDark ? "#ffffff" : "#f3f4f6"}
              />
            </View>
          </ThemedView>
        </ThemedView>

        {/* Theme Preview */}
        <ThemedView style={styles.previewSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Preview
          </ThemedText>

          <ThemedView style={styles.previewCard}>
            <ThemedText type="defaultSemiBold" style={styles.previewTitle}>
              Sample Content
            </ThemedText>
            <ThemedText style={styles.previewText}>
              This is how your app will look with the{" "}
              {isDark ? "dark" : "light"} theme.
            </ThemedText>
            <View style={styles.previewButtons}>
              <View
                style={[styles.previewButton, { backgroundColor: "#3b82f6" }]}
              >
                <ThemedText style={styles.previewButtonText}>
                  Primary
                </ThemedText>
              </View>
              <View
                style={[styles.previewButton, { backgroundColor: "#10b981" }]}
              >
                <ThemedText style={styles.previewButtonText}>
                  Success
                </ThemedText>
              </View>
            </View>
          </ThemedView>
        </ThemedView>
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
    padding: 20,
  },
  header: {
    marginBottom: 32,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  themeSection: {
    marginBottom: 24,
  },
  themeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  currentTheme: {
    opacity: 0.7,
    textTransform: "capitalize",
  },
  themeDescription: {
    opacity: 0.7,
    marginBottom: 16,
  },
  themeOptions: {
    gap: 8,
  },
  themeOption: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
    overflow: "hidden",
  },
  themeOptionSelected: {
    borderColor: "#3b82f6",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  },
  themeOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  themeOptionLeft: {
    flex: 1,
  },
  themeOptionDescription: {
    marginTop: 4,
    opacity: 0.7,
    fontSize: 14,
  },
  radioContainer: {
    marginLeft: 16,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: "#3b82f6",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#3b82f6",
  },
  quickToggleSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  quickToggleHeader: {
    flex: 1,
  },
  quickToggleDescription: {
    marginTop: 4,
    opacity: 0.7,
    fontSize: 14,
  },
  switchContainer: {
    marginLeft: 16,
  },
  previewSection: {
    marginBottom: 32,
  },
  previewCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  previewTitle: {
    marginBottom: 8,
  },
  previewText: {
    marginBottom: 16,
    opacity: 0.8,
  },
  previewButtons: {
    flexDirection: "row",
    gap: 12,
  },
  previewButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  previewButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  profileSection: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3b82f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
  profileDetails: {
    flex: 1,
  },
  profileEmail: {
    marginTop: 4,
    opacity: 0.7,
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
