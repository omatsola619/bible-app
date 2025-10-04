export type LessonStatus = 'completed' | 'current' | 'locked'

export interface Lesson {
  id: string
  title: string
  description: string
  status: LessonStatus
  duration: string // e.g., "5 min"
  color: string
}

export interface RoadmapSection {
  id: string
  title: string
  description: string
  lessons: Lesson[]
  color: string
}

export interface RoadmapData {
  sections: RoadmapSection[]
}
