import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'
import '../global.css'

import { AuthProvider, useAuth } from '@/contexts/auth-context'
import { BibleProvider } from '@/contexts/bible-context'
import { ThemeProvider as CustomThemeProvider, useTheme } from '@/contexts/theme-context'

export const unstable_settings = {
  anchor: '(tabs)',
}

function RootLayoutContent() {
  const { isAuthenticated, hasCompletedOnboarding, isLoading } = useAuth()
  const { isDark } = useTheme()
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    if (isLoading) {
      return
    }

    const inAuthGroup = segments[0] === '(tabs)'
    const inOnboarding = segments[0] === 'onboarding'
    const inAuthScreens = segments[0] === 'login' || segments[0] === 'signup'
    const inBibleScreens = segments[0] === 'bible'
    const inLessonScreens = segments[0] === 'lesson'

    if (!hasCompletedOnboarding && !inOnboarding) {
      // User hasn't completed onboarding, redirect to onboarding
      router.replace('/onboarding')
    } else if (hasCompletedOnboarding && !isAuthenticated && !inAuthScreens) {
      // User completed onboarding but not authenticated, redirect to login
      router.replace('/login')
    } else if (
      hasCompletedOnboarding &&
      isAuthenticated &&
      !inAuthGroup &&
      !inBibleScreens &&
      !inLessonScreens
    ) {
      // User is authenticated, redirect to main app (but allow Bible and lesson screens)
      router.replace('/(tabs)')
    }
  }, [
    isAuthenticated,
    hasCompletedOnboarding,
    isLoading,
    segments, // User is authenticated, redirect to main app
    router.replace,
  ])

  if (isLoading) {
    return null // Or a loading screen
  }

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="bible" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  )
}

export default function RootLayout() {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <BibleProvider>
          <RootLayoutContent />
        </BibleProvider>
      </AuthProvider>
    </CustomThemeProvider>
  )
}
