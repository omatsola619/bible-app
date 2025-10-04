import Icon from "@/components/Icon";
import ConfettiAnimation from "@/components/lesson/ConfettiAnimation";
import ProgressIndicator from "@/components/lesson/ProgressIndicator";
import QuestionCard from "@/components/lesson/QuestionCard";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { sampleLessonData } from "@/data/lesson-data";
import type { LessonData, LessonProgress, Question } from "@/types/lesson";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LessonScreen() {
  const [lessonData] = useState<LessonData>(sampleLessonData); // In real app, fetch by id
  const [progress, setProgress] = useState<LessonProgress>({
    currentStep: 1,
    totalSteps: 7, // 1 read + 4 exercises + 1 reflection + 1 summary
    completedSteps: [],
    score: 0,
    timeSpent: 0,
  });
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<
    string | number | boolean | undefined
  >(undefined);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [startTime] = useState(Date.now());

  const currentStepTitle = getStepTitle(progress.currentStep);
  const isLastStep = progress.currentStep === progress.totalSteps;

  const loadCurrentStep = useCallback(() => {
    if (progress.currentStep === 1) {
      // Read step - no question
      setCurrentQuestion(null);
    } else if (progress.currentStep >= 2 && progress.currentStep <= 5) {
      // Exercise steps
      const exerciseIndex = progress.currentStep - 2;
      setCurrentQuestion(lessonData.steps.exercises[exerciseIndex]);
    } else if (progress.currentStep === 6) {
      // Reflection step
      setCurrentQuestion(lessonData.steps.reflection);
    } else {
      // Summary step
      setCurrentQuestion(null);
    }
    setSelectedAnswer(undefined);
    setShowResult(false);
  }, [progress.currentStep, lessonData.steps]);

  useEffect(() => {
    loadCurrentStep();
  }, [loadCurrentStep]);

  useEffect(() => {
    // Track time spent
    const interval = setInterval(() => {
      setProgress((prev) => ({
        ...prev,
        timeSpent: Math.floor((Date.now() - startTime) / 1000),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  function getStepTitle(step: number): string {
    if (step === 1) {
      return "Read the Verse";
    }
    if (step >= 2 && step <= 5) {
      return "Exercise";
    }
    if (step === 6) {
      return "Reflection";
    }
    if (step === 7) {
      return "Lesson Complete!";
    }
    return "Lesson";
  }

  function handleAnswerSelect(answer: string | number | boolean) {
    setSelectedAnswer(answer);
    // Auto-check answer for multiple choice, true/false, and verse recall
    if (
      currentQuestion &&
      (currentQuestion.type === "multiple_choice" ||
        currentQuestion.type === "true_false" ||
        currentQuestion.type === "verse_recall" ||
        currentQuestion.type === "reflection")
    ) {
      checkAnswer(answer);
    }
  }

  function handleCheckAnswer() {
    if (selectedAnswer !== undefined) {
      checkAnswer(selectedAnswer);
    }
  }

  function handleTextChange(text: string) {
    setSelectedAnswer(text);
  }

  function checkAnswer(answer: string | number | boolean) {
    if (!currentQuestion) {
      return;
    }

    let correct = false;

    if (
      currentQuestion.type === "multiple_choice" ||
      currentQuestion.type === "verse_recall" ||
      currentQuestion.type === "reflection"
    ) {
      const selectedOption = currentQuestion.options?.find(
        (opt) => opt.id === answer
      );
      correct = selectedOption?.isCorrect || false;
    } else if (currentQuestion.type === "true_false") {
      correct = answer === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === "fill_blank") {
      correct =
        answer.toString().toLowerCase() ===
        currentQuestion.correctAnswer?.toString().toLowerCase();
    }

    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setProgress((prev) => ({
        ...prev,
        score: prev.score + 1,
      }));
    }
  }

  function handleContinue() {
    if (progress.currentStep === 1) {
      // From read step to first exercise
      setProgress((prev) => ({
        ...prev,
        currentStep: 2,
        completedSteps: [...prev.completedSteps, 1],
      }));
    } else if (progress.currentStep >= 2 && progress.currentStep <= 6) {
      // From exercise/reflection to next step
      setProgress((prev) => ({
        ...prev,
        currentStep: prev.currentStep + 1,
        completedSteps: [...prev.completedSteps, prev.currentStep],
      }));
    } else if (progress.currentStep === 7) {
      // Lesson complete
      setShowConfetti(true);
    }
  }

  function handleFinishLesson() {
    Alert.alert(
      "Lesson Complete! 🎉",
      `Congratulations! You scored ${progress.score}/${
        progress.totalSteps - 1
      } and earned ${lessonData.rewardPoints} XP!`,
      [
        {
          text: "Continue Learning",
          onPress: () => router.back(),
        },
      ]
    );
  }

  function renderReadStep() {
    return (
      <ThemedView className="rounded-2xl p-6 shadow-lg">
        <View className="mb-6 items-center">
          <Icon name="book" size={48} color="#4CAF50" />
        </View>
        <ThemedText className="mb-4 text-center font-semibold text-lg">
          {lessonData.verseReference}
        </ThemedText>
        <ThemedText className="text-center text-base italic leading-7">
          "{lessonData.steps.read.verseText}"
        </ThemedText>
        <View className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900">
          <ThemedText className="text-center text-blue-800 text-sm dark:text-blue-200">
            💡 Take a moment to read and understand this verse before moving to
            the exercises.
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  function renderSummaryStep() {
    const percentage = Math.round(
      (progress.score / (progress.totalSteps - 1)) * 100
    );

    return (
      <ThemedView className="rounded-2xl p-6 shadow-lg">
        <View className="mb-6 items-center">
          <Icon name="trophy" size={64} color="#FFD700" />
        </View>
        <ThemedText className="mb-4 text-center font-bold text-2xl">
          Lesson Complete!
        </ThemedText>
        <ThemedText className="mb-6 text-center text-lg">
          {lessonData.title}
        </ThemedText>

        <View className="space-y-4">
          <View className="flex-row items-center justify-between rounded-lg bg-green-50 p-4 dark:bg-green-900">
            <ThemedText className="font-medium text-base">Score</ThemedText>
            <ThemedText className="font-bold text-green-600 text-lg dark:text-green-400">
              {progress.score}/{progress.totalSteps - 1} ({percentage}%)
            </ThemedText>
          </View>

          <View className="flex-row items-center justify-between rounded-lg bg-blue-50 p-4 dark:bg-blue-900">
            <ThemedText className="font-medium text-base">XP Earned</ThemedText>
            <ThemedText className="font-bold text-blue-600 text-lg dark:text-blue-400">
              {lessonData.rewardPoints}
            </ThemedText>
          </View>

          <View className="flex-row items-center justify-between rounded-lg bg-purple-50 p-4 dark:bg-purple-900">
            <ThemedText className="font-medium text-base">
              Time Spent
            </ThemedText>
            <ThemedText className="font-bold text-lg text-purple-600 dark:text-purple-400">
              {Math.floor(progress.timeSpent / 60)}:
              {(progress.timeSpent % 60).toString().padStart(2, "0")}
            </ThemedText>
          </View>
        </View>
      </ThemedView>
    );
  }

  function renderCurrentStep() {
    if (progress.currentStep === 1) {
      return renderReadStep();
    } else if (progress.currentStep === 7) {
      return renderSummaryStep();
    } else if (currentQuestion) {
      return (
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
          onCheckAnswer={handleCheckAnswer}
          onTextChange={handleTextChange}
          showResult={showResult}
          isCorrect={isCorrect}
        />
      );
    }
    return null;
  }

  function canContinue() {
    if (progress.currentStep === 1) {
      return true; // Read step
    }
    if (progress.currentStep === 7) {
      return true; // Summary step
    }
    return selectedAnswer !== undefined && showResult; // Exercise/reflection steps
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ConfettiAnimation
        isVisible={showConfetti}
        onComplete={handleFinishLesson}
      />

      <ScrollView className="flex-1">
        {/* Progress Indicator */}
        <ProgressIndicator
          currentStep={progress.currentStep}
          totalSteps={progress.totalSteps}
          stepTitle={currentStepTitle}
        />

        {/* Content */}
        <View className="px-6 pb-6">{renderCurrentStep()}</View>
      </ScrollView>

      {/* Continue Button */}
      <View className="border-gray-200 border-t bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <TouchableOpacity
          className={`rounded-xl px-6 py-4 ${
            canContinue() ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
          }`}
          onPress={handleContinue}
          disabled={!canContinue()}
        >
          <ThemedText className="text-center font-semibold text-lg text-white">
            {isLastStep ? "Finish Lesson" : "Continue"}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
