import { FormEvent, useState } from "react"
import styled from "styled-components"
import NumberInput from "./NumberInput"
import { Answer } from "./Types"
import Button from "./Button"

type Props = {
    onSubmit: (answer: Answer) => void
}

export default function Form({ onSubmit }: Props) {
    const [angle, setAngle] = useState(0)

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        onSubmit({ angle })
    }

    return (
        <EingabeForm
            onSubmit={handleSubmit}
            aria-label="Wieviel Grad hat der Winkel?"
        >
            <Text>
              Der Winkel hat
              <NumberInput id={'angle'} setter={setAngle} />
              Grad.
            </Text>
            <Button type="submit">Ok</Button>
        </EingabeForm>
    )
}

const Text = styled.p`
  display: flex;
`

const EingabeForm = styled.form`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;

    width: 100%;
`

