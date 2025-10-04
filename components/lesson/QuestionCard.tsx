import { TextInput, TouchableOpacity, View } from 'react-native'
import Icon from '@/components/Icon'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import type { Question } from '@/types/lesson'

interface QuestionCardProps {
  question: Question
  selectedAnswer?: string | number | boolean | undefined
  onAnswerSelect: (answer: string | number | boolean) => void
  onCheckAnswer?: () => void
  showResult?: boolean
  isCorrect?: boolean
  onTextChange?: (text: string) => void
}

export default function QuestionCard({
  question,
  selectedAnswer,
  onAnswerSelect,
  onCheckAnswer,
  showResult = false,
  isCorrect = false,
  onTextChange,
}: QuestionCardProps) {
  const renderMultipleChoice = () => {
    if (!question.options) {
      return null
    }

    return (
      <View className="space-y-3">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option.id
          const isCorrectOption = option.isCorrect
          const showCorrect = showResult && isCorrectOption
          const showIncorrect = showResult && isSelected && !isCorrectOption

          let bgColor = 'bg-white dark:bg-gray-800'
          let borderColor = 'border-gray-200 dark:border-gray-700'

          if (showResult) {
            if (showCorrect) {
              bgColor = 'bg-green-100 dark:bg-green-900'
              borderColor = 'border-green-500'
            } else if (showIncorrect) {
              bgColor = 'bg-red-100 dark:bg-red-900'
              borderColor = 'border-red-500'
            }
          } else if (isSelected) {
            bgColor = 'bg-blue-100 dark:bg-blue-900'
            borderColor = 'border-blue-500'
          }

          return (
            <TouchableOpacity
              key={option.id}
              className={`rounded-xl border-2 p-4 ${bgColor} ${borderColor}`}
              onPress={() => onAnswerSelect(option.id)}
              disabled={showResult}
            >
              <View className="flex-row items-center justify-between">
                <ThemedText className="flex-1 font-medium text-base">{option.text}</ThemedText>
                {showResult && (
                  <Icon
                    name={showCorrect ? 'check' : showIncorrect ? 'close' : 'check'}
                    size={20}
                    color={showCorrect ? '#10B981' : showIncorrect ? '#EF4444' : '#6B7280'}
                  />
                )}
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  const renderFillBlank = () => {
    return (
      <View className="space-y-4">
        <ThemedText className="text-base leading-6">{question.question}</ThemedText>
        <View className="rounded-xl bg-gray-100 p-4 dark:bg-gray-700">
          {showResult ? (
            <ThemedText className="text-center font-medium text-lg">
              {selectedAnswer || '______'}
            </ThemedText>
          ) : (
            <TextInput
              className="text-center font-medium text-gray-900 text-lg dark:text-white"
              placeholder="Type your answer here"
              placeholderTextColor="#6B7280"
              value={(selectedAnswer as string) || ''}
              onChangeText={onTextChange}
              autoCapitalize="none"
              autoCorrect={false}
            />
          )}
        </View>
        {!showResult && onCheckAnswer && selectedAnswer && (
          <TouchableOpacity className="rounded-lg bg-blue-500 px-4 py-2" onPress={onCheckAnswer}>
            <ThemedText className="text-center font-medium text-white">Check Answer</ThemedText>
          </TouchableOpacity>
        )}
        {showResult && (
          <View
            className={`rounded-lg p-3 ${
              isCorrect ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
            }`}
          >
            <ThemedText
              className={`font-medium text-sm ${
                isCorrect ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
              }`}
            >
              Correct answer: {question.correctAnswer}
            </ThemedText>
          </View>
        )}
      </View>
    )
  }

  const renderTrueFalse = () => {
    const options = [
      { id: 'true', text: 'True', value: true },
      { id: 'false', text: 'False', value: false },
    ]

    return (
      <View className="space-y-3">
        <ThemedText className="mb-4 text-base leading-6">{question.question}</ThemedText>
        <View className="flex-row space-x-4">
          {options.map((option) => {
            const isSelected = selectedAnswer === option.value
            const isCorrectOption = question.correctAnswer === option.value
            const showCorrect = showResult && isCorrectOption
            const showIncorrect = showResult && isSelected && !isCorrectOption

            let bgColor = 'bg-white dark:bg-gray-800'
            let borderColor = 'border-gray-200 dark:border-gray-700'

            if (showResult) {
              if (showCorrect) {
                bgColor = 'bg-green-100 dark:bg-green-900'
                borderColor = 'border-green-500'
              } else if (showIncorrect) {
                bgColor = 'bg-red-100 dark:bg-red-900'
                borderColor = 'border-red-500'
              }
            } else if (isSelected) {
              bgColor = 'bg-blue-100 dark:bg-blue-900'
              borderColor = 'border-blue-500'
            }

            return (
              <TouchableOpacity
                key={option.id}
                className={`flex-1 rounded-xl border-2 p-4 ${bgColor} ${borderColor}`}
                onPress={() => onAnswerSelect(option.value)}
                disabled={showResult}
              >
                <ThemedText className="text-center font-medium text-base">{option.text}</ThemedText>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
  }

  const renderQuestion = () => {
    switch (question.type) {
      case 'multiple_choice':
      case 'verse_recall':
      case 'reflection':
        return renderMultipleChoice()
      case 'fill_blank':
        return renderFillBlank()
      case 'true_false':
        return renderTrueFalse()
      default:
        return null
    }
  }

  return (
    <ThemedView className="rounded-2xl p-6 shadow-lg">
      <ThemedText className="mb-4 font-semibold text-lg">{question.question}</ThemedText>
      {renderQuestion()}
      {showResult && question.explanation && (
        <View className="mt-4 rounded-lg bg-blue-50 p-3 dark:bg-blue-900">
          <ThemedText className="text-blue-800 text-sm dark:text-blue-200">
            💡 {question.explanation}
          </ThemedText>
        </View>
      )}
    </ThemedView>
  )
}
