import type { LessonData } from '@/types/lesson'

export const sampleLessonData: LessonData = {
  id: 'lesson-john-6-35',
  title: 'Jesus the Bread of Life',
  verseReference: 'John 6:35',
  verseText:
    'Then Jesus declared, "I am the bread of life. Whoever comes to me will never go hungry, and whoever believes in me will never be thirsty."',
  steps: {
    read: {
      verseText:
        'Then Jesus declared, "I am the bread of life. Whoever comes to me will never go hungry, and whoever believes in me will never be thirsty."',
      verseReference: 'John 6:35',
    },
    exercises: [
      {
        id: 'q1',
        type: 'multiple_choice',
        question: 'What did Jesus declare about himself?',
        options: [
          { id: 'a', text: 'I am the water of life', isCorrect: false },
          { id: 'b', text: 'I am the bread of life', isCorrect: true },
          { id: 'c', text: 'I am the light of life', isCorrect: false },
          { id: 'd', text: 'I am the way of life', isCorrect: false },
        ],
        explanation: 'Jesus declared himself to be "the bread of life" in this verse.',
      },
      {
        id: 'q2',
        type: 'fill_blank',
        question: 'Complete the verse: "Whoever comes to me will never go ___"',
        correctAnswer: 'hungry',
        explanation: 'The verse says "Whoever comes to me will never go hungry"',
      },
      {
        id: 'q3',
        type: 'true_false',
        question: 'Jesus promises that believers will never be thirsty.',
        correctAnswer: true,
        explanation: 'Yes, Jesus says "whoever believes in me will never be thirsty."',
      },
      {
        id: 'q4',
        type: 'verse_recall',
        question: 'Which book and chapter contains this verse?',
        options: [
          { id: 'a', text: 'Matthew 6:35', isCorrect: false },
          { id: 'b', text: 'John 6:35', isCorrect: true },
          { id: 'c', text: 'Luke 6:35', isCorrect: false },
          { id: 'd', text: 'Mark 6:35', isCorrect: false },
        ],
        explanation: 'This verse is found in John chapter 6, verse 35.',
      },
    ],
    reflection: {
      id: 'reflection',
      type: 'reflection',
      question: 'How does this verse apply to your daily life?',
      options: [
        {
          id: 'a',
          text: 'I should seek Jesus when I feel spiritually empty',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'This verse only applies to physical hunger',
          isCorrect: false,
        },
        { id: 'c', text: 'I need to eat more bread', isCorrect: false },
        { id: 'd', text: 'This verse is not relevant today', isCorrect: false },
      ],
      explanation: 'Jesus offers spiritual fulfillment that satisfies our deepest needs.',
    },
  },
  rewardPoints: 50,
  estimatedDuration: '5 min',
}
