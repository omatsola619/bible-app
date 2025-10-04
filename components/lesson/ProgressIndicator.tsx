import { View } from 'react-native'
import { ThemedText } from '@/components/themed-text'

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  stepTitle: string
}

export default function ProgressIndicator({
  currentStep,
  totalSteps,
  stepTitle,
}: ProgressIndicatorProps) {
  return (
    <View className="px-6 py-4">
      <View className="mb-2 flex-row items-center justify-between">
        <ThemedText className="font-medium text-gray-600 text-sm dark:text-gray-400">
          Step {currentStep} of {totalSteps}
        </ThemedText>
        <ThemedText className="font-medium text-gray-600 text-sm dark:text-gray-400">
          {Math.round((currentStep / totalSteps) * 100)}%
        </ThemedText>
      </View>

      <View className="mb-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
        <View
          className="h-2 rounded-full bg-green-500 transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </View>

      <ThemedText className="text-center font-semibold text-lg">{stepTitle}</ThemedText>
    </View>
  )
}
