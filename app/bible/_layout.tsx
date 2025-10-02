import { Stack } from 'expo-router'

export default function BibleLayout() {
  return (
    <Stack>
      <Stack.Screen name="chapter" options={{ headerShown: false }} />
    </Stack>
  )
}
