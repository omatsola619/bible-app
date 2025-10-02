import { Link, router } from 'expo-router'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useAuth } from '@/contexts/auth-context'

export default function OnboardingScreen() {
  const { completeOnboarding } = useAuth()

  const handleGetStarted = async () => {
    await completeOnboarding()
    router.push('/signup')
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        {/* App Icon/Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <ThemedText type="title" style={styles.logoText}>
              📖
            </ThemedText>
          </View>
        </View>

        {/* App Introduction */}
        <View style={styles.textContainer}>
          <ThemedText type="title" style={styles.title}>
            Welcome to Biblia2
          </ThemedText>
          <ThemedText style={styles.subtitle}>Your personal digital Bible companion</ThemedText>
          <ThemedText style={styles.description}>
            Discover, read, and study the Bible with modern tools and beautiful design. Access
            multiple translations, create notes, and deepen your faith journey.
          </ThemedText>
        </View>

        {/* Features Preview */}
        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <ThemedText style={styles.featureIcon}>📚</ThemedText>
            <ThemedText style={styles.featureText}>Multiple Bible translations</ThemedText>
          </View>
          <View style={styles.feature}>
            <ThemedText style={styles.featureIcon}>📝</ThemedText>
            <ThemedText style={styles.featureText}>Personal notes and highlights</ThemedText>
          </View>
          <View style={styles.feature}>
            <ThemedText style={styles.featureIcon}>🔍</ThemedText>
            <ThemedText style={styles.featureText}>Powerful search and study tools</ThemedText>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleGetStarted}>
          <ThemedText style={styles.primaryButtonText}>Get Started</ThemedText>
        </TouchableOpacity>

        <View style={styles.authLinks}>
          <Link href="/login" asChild={true}>
            <TouchableOpacity style={styles.secondaryButton}>
              <ThemedText style={styles.secondaryButtonText}>I already have an account</ThemedText>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
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
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  logoText: {
    fontSize: 48,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 20,
    fontSize: 18,
  },
  description: {
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 24,
    maxWidth: 300,
  },
  featuresContainer: {
    width: '100%',
    maxWidth: 300,
  },
  feature: {
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
  },
  actionsContainer: {
    paddingTop: 20,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  authLinks: {
    alignItems: 'center',
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  secondaryButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '500',
  },
})
