import { useState } from 'react'
import styled from 'styled-components'
import useExercise from './internal/useExercise'
import Visualization from './internal/Visualization'
import Form from './internal/Form'
import { Answer, Difficulty, Result } from './internal/Types'
import Button from './internal/Button'

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
            <Description>
              Miss den Winkel!
            </Description>
            <CanvasWrapper>
                <Visualization exercise={exercise} />
            </CanvasWrapper>
            <Flex>
                {ergebnis == null && (
                    <Form onSubmit={handleSubmit} />
                )}
                {ergebnis != null && (
                    <Report>
                      <div>
                        <p>
                          Der Winkel hat {exercise.expectedAngle} Grad.
                          Deine Antwort war "{answer?.angle} Grad".
                        </p>
                        <Feedback>
                            {ergebnis === Result.Correct && ("Richtig! Sehr gut!")}
                            {ergebnis === Result.Almost && ("Fast richtig! Nur 1 Grad daneben.")}
                            {ergebnis === Result.Wrong && ("Leider falsch.")}
                        </Feedback>
                      </div>
                      <Button type="button" onClick={next}>Nochmal</Button>
                    </Report>
                )}
            </Flex>
        </Wrapper>
    )
}

const Description = styled.p`
  margin: 15px;
  flex: 1;
  display: flex;
  align-items: center;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`

const CanvasWrapper = styled.section`
  flex: 10;
  min-height: 100px;
  border: 2px solid #83c5be;
  border-radius: 5px;
`

const Report = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;

  width: 100%;
`

const Flex = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px;
  flex: 2;
  min-height: 100px;
`

const Feedback = styled.p`
  font-weight: bold;
`