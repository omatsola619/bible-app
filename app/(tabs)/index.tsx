import { router } from 'expo-router'
import { useRef, useState } from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from '@/components/Icon'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { useTheme } from '@/contexts/theme-context'
import { roadmapData } from '@/data/roadmap-data'
import type { Lesson, RoadmapSection } from '@/types/roadmap'

export default function HomeScreen() {
  const { isDark } = useTheme()
  const [currentSectionColor, setCurrentSectionColor] = useState(roadmapData.sections[0].color)
  const scrollViewRef = useRef<ScrollView>(null)
  const sectionRefs = useRef<{ [key: string]: View | null }>({})
  const styles = getStyles(isDark, currentSectionColor)

  const handleScroll = (event: {
    nativeEvent: {
      contentOffset: { y: number }
      layoutMeasurement: { height: number }
    }
  }) => {
    const scrollY = event.nativeEvent.contentOffset.y
    const screenHeight = event.nativeEvent.layoutMeasurement.height
    const centerY = scrollY + screenHeight / 2

    // Find which section is currently in the center of the screen
    for (let i = 0; i < roadmapData.sections.length; i++) {
      const section = roadmapData.sections[i]
      const sectionRef = sectionRefs.current[section.id]

      if (sectionRef) {
        sectionRef.measure((_x, _y, _width, _height, _pageX, pageY) => {
          const sectionTop = pageY
          const sectionBottom = pageY + _height

          if (centerY >= sectionTop && centerY <= sectionBottom) {
            setCurrentSectionColor(section.color)
          }
        })
      }
    }
  }

  const renderLessonNode = (lesson: Lesson, index: number, isLast: boolean) => {
    const getNodeIcon = () => {
      switch (lesson.status) {
        case 'completed':
          return <Icon name="check" size={24} color="#FFFFFF" />
        case 'current':
          return <Icon name="star" size={24} color="#FFFFFF" />
        case 'locked':
          return <Icon name="lock" size={20} color="#FFFFFF" />
        default:
          return null
      }
    }

    const getNodeStyle = () => {
      const baseStyle = {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }

      switch (lesson.status) {
        case 'completed':
          return {
            ...baseStyle,
            backgroundColor: lesson.color,
          }
        case 'current':
          return {
            ...baseStyle,
            backgroundColor: lesson.color,
            borderWidth: 4,
            borderColor: '#FFFFFF',
          }
        case 'locked':
          return {
            ...baseStyle,
            backgroundColor: '#E5E7EB',
            borderWidth: 2,
            borderColor: '#9CA3AF',
          }
        default:
          return baseStyle
      }
    }

    return (
      <View key={lesson.id} style={styles.lessonContainer}>
        <TouchableOpacity
          style={getNodeStyle()}
          onPress={() => {
            if (lesson.status !== 'locked') {
              router.push(`/lesson/${lesson.id}`)
            }
          }}
          disabled={lesson.status === 'locked'}
        >
          {getNodeIcon()}
        </TouchableOpacity>

        {!isLast && (
          <View
            style={[
              styles.connectionLine,
              {
                backgroundColor: lesson.status === 'locked' ? '#E5E7EB' : lesson.color,
                height: index % 2 === 0 ? 80 : 60, // Zig-zag pattern
              },
            ]}
          />
        )}
      </View>
    )
  }

  const renderSection = (section: RoadmapSection) => {
    return (
      <View
        key={section.id}
        style={styles.sectionContainer}
        ref={(ref: View | null) => {
          sectionRefs.current[section.id] = ref
        }}
      >
        <View style={[styles.sectionHeader, { backgroundColor: section.color }]}>
          <ThemedText type="title" style={styles.sectionTitle}>
            {section.title}
          </ThemedText>
          <ThemedText style={styles.sectionDescription}>{section.description}</ThemedText>
        </View>

        <View style={styles.lessonsContainer}>
          <View style={styles.lessonsPath}>
            {section.lessons.map((lesson, index) =>
              renderLessonNode(lesson, index, index === section.lessons.length - 1)
            )}
          </View>

          <View style={styles.lessonsInfo}>
            {section.lessons.map((lesson, _index) => (
              <View key={`${lesson.id}-info`} style={styles.lessonInfo}>
                <ThemedText
                  type="defaultSemiBold"
                  style={[styles.lessonTitle, lesson.status === 'locked' && styles.lockedText]}
                >
                  {lesson.title}
                </ThemedText>
                <ThemedText
                  style={[
                    styles.lessonDescription,
                    lesson.status === 'locked' && styles.lockedText,
                  ]}
                >
                  {lesson.description}
                </ThemedText>
                <ThemedText
                  style={[styles.lessonDuration, lesson.status === 'locked' && styles.lockedText]}
                >
                  {lesson.duration}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        {/* Duolingo-style top bar */}
        <View style={styles.topBar}>
          <View style={styles.levelSection}>
            <View style={styles.levelIcon}>
              <ThemedText style={styles.levelNumber}>12</ThemedText>
            </View>
            <ThemedText style={styles.levelText}>Level</ThemedText>
          </View>

          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Icon name="star" size={20} color="#FFD700" />
              <ThemedText style={styles.statValue}>2,450</ThemedText>
              <ThemedText style={styles.statLabel}>XP</ThemedText>
            </View>

            <View style={styles.statItem}>
              <Icon name="check" size={20} color="#4CAF50" />
              <ThemedText style={styles.statValue}>7</ThemedText>
              <ThemedText style={styles.statLabel}>Day Streak</ThemedText>
            </View>
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {roadmapData.sections.map(renderSection)}
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  )
}

const getStyles = (isDark: boolean, currentSectionColor: string) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#F8FAFC',
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
    },
    levelSection: {
      alignItems: 'center',
    },
    levelIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: currentSectionColor,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    levelNumber: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    levelText: {
      fontSize: 12,
      color: isDark ? '#9CA3AF' : '#6B7280',
      fontWeight: '500',
    },
    statsSection: {
      flexDirection: 'row',
      gap: 24,
    },
    statItem: {
      alignItems: 'center',
      minWidth: 60,
    },
    statValue: {
      fontSize: 18,
      fontWeight: 'bold',
      color: isDark ? '#FFFFFF' : '#1F2937',
      marginTop: 4,
    },
    statLabel: {
      fontSize: 11,
      color: isDark ? '#9CA3AF' : '#6B7280',
      fontWeight: '500',
      textAlign: 'center',
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 40,
    },
    sectionContainer: {
      margin: 16,
      borderRadius: 16,
      overflow: 'hidden',
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    sectionHeader: {
      padding: 20,
      paddingBottom: 16,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 8,
    },
    sectionDescription: {
      fontSize: 16,
      color: '#FFFFFF',
      opacity: 0.9,
    },
    lessonsContainer: {
      padding: 20,
      flexDirection: 'row',
    },
    lessonsPath: {
      alignItems: 'center',
      marginRight: 20,
    },
    lessonContainer: {
      alignItems: 'center',
    },
    connectionLine: {
      width: 4,
      marginVertical: 4,
    },
    lessonsInfo: {
      flex: 1,
      paddingTop: 10,
    },
    lessonInfo: {
      marginBottom: 60,
      paddingLeft: 16,
    },
    lessonTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#1F2937',
      marginBottom: 4,
    },
    lessonDescription: {
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
      marginBottom: 4,
    },
    lessonDuration: {
      fontSize: 12,
      color: isDark ? '#6B7280' : '#9CA3AF',
      fontWeight: '500',
    },
    lockedText: {
      color: isDark ? '#6B7280' : '#9CA3AF',
    },
  })
