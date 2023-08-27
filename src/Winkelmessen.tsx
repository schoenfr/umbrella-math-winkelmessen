import { useState } from 'react'
import styled from 'styled-components'
import useExercise from './internal/useExercise'
import Visualization from './internal/Visualization'
import Eingabeformular from './internal/Eingabeformular'
import { Answer, Difficulty, Result } from './internal/Types'

type Props = {
    /** 0 is very easy, 5 is hard */
    difficulty?: Difficulty
    /** is called on each answer submitted by the user */
    onAnswer?: (correct: boolean) => void
}

export default function Winkelmessen({ difficulty = 5, onAnswer }: Props) {
    const [ergebnis, setErgebnis] = useState<Result | null>(null)
    const [answer, setAnswer] = useState<Answer | null>(null)
    const { exercise, generateNewExercise, evaluate } = useExercise(difficulty)

    function handleSubmit(answer: Answer) {
        const ergebnis = evaluate(answer)
        setAnswer(answer)
        setErgebnis(ergebnis)
        onAnswer?.(ergebnis === Result.Correct || ergebnis === Result.Almost)
    }

    function next() {
        generateNewExercise()
        setErgebnis(null)
        setAnswer(null)
    }

    return (
        <Wrapper>
            <CanvasWrapper>
                <Visualization exercise={exercise} />
            </CanvasWrapper>
            <Flex>
                {ergebnis == null && (
                    <Eingabeformular onSubmit={handleSubmit} />
                )}
                {ergebnis != null && (
                    <EingabeForm as="section">
                        Der Winkel hat {exercise.expectedAngle} Grad.
                        Deine Antwort war "{answer?.angle} Grad".
                        <Feedback>
                            {ergebnis === Result.Correct && ("Richtig! Sehr gut!")}
                            {ergebnis === Result.Almost && ("Fast richtig! Nur 1 Grad daneben.")}
                            {ergebnis === Result.Wrong && ("Leider falsch.")}
                        </Feedback>
                        <OkayButton onClick={next}>Nochmal</OkayButton>
                    </EingabeForm>
                )}
            </Flex>
        </Wrapper>
    )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`

const CanvasWrapper = styled.section`
  flex: 1;
  min-height: 100px;
`

const EingabeForm = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 140px;
  gap: 5px;
`

const OkayButton = styled.button`
  margin-left: 50px;
`

const Flex = styled.section`
  display: flex;
  justify-content: center;
`

const Feedback = styled.p`
  font-weight: bold;
`