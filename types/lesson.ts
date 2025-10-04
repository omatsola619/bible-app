export type QuestionType =
  | 'multiple_choice'
  | 'fill_blank'
  | 'true_false'
  | 'match'
  | 'verse_recall'
  | 'reflection'

export type LessonStep = 'read' | 'exercise' | 'reflection' | 'summary'

export interface MultipleChoiceOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface Question {
  id: string
  type: QuestionType
  question: string
  options?: MultipleChoiceOption[]
  correctAnswer?: string | number | boolean
  explanation?: string
  verseReference?: string
}

export interface LessonData {
  id: string
  title: string
  verseReference: string
  verseText: string
  steps: {
    read: {
      verseText: string
      verseReference: string
    }
    exercises: Question[]
    reflection: Question
  }
  rewardPoints: number
  estimatedDuration: string
}

export interface LessonProgress {
  currentStep: number
  totalSteps: number
  completedSteps: number[]
  score: number
  timeSpent: number
}
