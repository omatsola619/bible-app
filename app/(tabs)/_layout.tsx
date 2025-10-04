import { Tabs } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Icon from '@/components/Icon'
import { useTheme } from '@/contexts/theme-context'

export default function TabLayout() {
  const { isDark } = useTheme()
  const insets = useSafeAreaInsets()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4CAF50', // Primary green
        tabBarInactiveTintColor: isDark ? '#6B7280' : '#9CA3AF',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: isDark ? '#000000' : '#FFFFFF',
          borderTopColor: isDark ? '#374151' : '#E5E7EB',
          height: 65 + insets.bottom,
          paddingBottom: insets.bottom + 10,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Icon name="home" size={focused ? 28 : 24} color={focused ? '#4CAF50' : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bible"
        options={{
          title: 'Bible',
          tabBarIcon: ({ color, focused }) => (
            <Icon name="bible" size={focused ? 28 : 24} color={focused ? '#4CAF50' : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, focused }) => (
            <Icon name="progress" size={focused ? 28 : 24} color={focused ? '#FFD700' : color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Icon name="profile" size={focused ? 28 : 24} color={focused ? '#4CAF50' : color} />
          ),
        }}
      />
    </Tabs>
  )
}
