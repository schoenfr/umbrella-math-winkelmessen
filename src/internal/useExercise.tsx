import { useState } from 'react'
import { Answer, Difficulty, Exercise, Result } from './Types'

function randomize(min: number, max: number) {
  return min + Math.floor(Math.random() * (1 + max - min))
}

export default function useExercise(difficulty: Difficulty) {
  const [exercise, setExercise] = useState<Exercise>(generate())

  function generate() {
    let startAngle = randomize(0, 360)
    let expectedAngle = 0
    if (difficulty === 5) {
      expectedAngle = randomize(0, 360)
    } else if (difficulty === 4) {
      expectedAngle = randomize(0, 240)
    } else if (difficulty === 3) {
      expectedAngle = randomize(1, 60) * 5
    } else if (difficulty === 2) {
      expectedAngle = randomize(1, 40) * 5
    } else if (difficulty === 1) {
      expectedAngle = randomize(1, 10) * 10
      startAngle = randomize(1, 3) * 90
    } else {
      expectedAngle = randomize(1, 10) * 10
      startAngle = 0
    }
    return { startAngle, expectedAngle }
  }

  function generateNewExercise() {
    setExercise(generate())
  }

  function evaluate(answer: Answer) {
    const difference = Math.abs(answer.angle - exercise.expectedAngle)
    if (difference === 0) {
      return Result.Correct
    } else if (difference <= 1) {
      return Result.Almost
    } else {
      return Result.Wrong
    }
  }

  return { exercise, generateNewExercise, evaluate }
}
