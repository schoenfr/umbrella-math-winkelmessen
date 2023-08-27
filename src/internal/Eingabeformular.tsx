import { FormEvent, useState } from "react"
import styled from "styled-components"
import NumberInput from "./NumberInput"
import { Answer } from "./Types"

type Props = {
    onSubmit: (answer: Answer) => void
}

export default function Eingabeformular({ onSubmit }: Props) {
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
            <SrOnly htmlFor="angle" as="label">
                Grad
            </SrOnly>
            <p>Der Winkel hat</p>
            <NumberInput id={'angle'} setter={setAngle} />
            <p>Grad.</p>
            <OkayButton type="submit">Ok</OkayButton>
        </EingabeForm>
    )
}

const EingabeForm = styled.form`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 140px;
    gap: 10px;
`

const OkayButton = styled.button`
    margin-left: 50px;
`

const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`
