import { useEffect, useRef } from 'react'
import { Animated, Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

interface ConfettiAnimationProps {
  isVisible: boolean
  onComplete?: () => void
}

export default function ConfettiAnimation({ isVisible, onComplete }: ConfettiAnimationProps) {
  const confettiRefs = useRef<Animated.Value[]>([])
  const opacityRef = useRef(new Animated.Value(0))

  useEffect(() => {
    if (isVisible) {
      // Create confetti pieces
      confettiRefs.current = Array.from({ length: 50 }, () => new Animated.Value(0))

      // Start animation
      opacityRef.current.setValue(1)

      // Animate each confetti piece
      confettiRefs.current.forEach((confetti, index) => {
        const delay = index * 50
        const duration = 2000 + Math.random() * 1000
        const _translateX = (Math.random() - 0.5) * width * 2
        const _translateY = height + Math.random() * 200

        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(confetti, {
              toValue: 1,
              duration,
              useNativeDriver: true,
            }),
            Animated.timing(opacityRef.current, {
              toValue: 0,
              duration: duration - 500,
              useNativeDriver: true,
            }),
          ]),
        ]).start()
      })

      // Call onComplete after animation
      setTimeout(() => {
        onComplete?.()
      }, 3000)
    }
  }, [isVisible, onComplete])

  if (!isVisible) {
    return null
  }

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: opacityRef.current,
        pointerEvents: 'none',
      }}
    >
      {confettiRefs.current.map((confetti, index) => {
        const translateX = (Math.random() - 0.5) * width * 2
        const translateY = height + Math.random() * 200
        const rotation = Math.random() * 360
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD']
        const color = colors[Math.floor(Math.random() * colors.length)]
        const confettiId = `confetti-${index}-${Date.now()}`

        return (
          <Animated.View
            key={confettiId}
            style={{
              position: 'absolute',
              left: width / 2,
              top: -50,
              width: 10,
              height: 10,
              backgroundColor: color,
              transform: [
                {
                  translateX: confetti.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, translateX],
                  }),
                },
                {
                  translateY: confetti.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, translateY],
                  }),
                },
                {
                  rotate: confetti.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', `${rotation}deg`],
                  }),
                },
              ],
            }}
          />
        )
      })}
    </Animated.View>
  )
}
