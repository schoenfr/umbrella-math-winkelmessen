import { useEffect, useState } from 'react'
import styled from 'styled-components'

type Props = {
  reset?: boolean
  setter: (wert: number) => void
  maxLength?: number
  id: string
}

export default function NumberInput({
  reset = false,
  setter,
  maxLength,
  id,
}: Props) {
  const [wert, setWert] = useState<string>('')

  useEffect(() => {
    if (reset) {
      setWert('')
    }
  }, [reset])

  function onNeuerWert(neuerWert: string) {
    setWert(neuerWert)
    setter(Number(neuerWert))
  }

  return (
    <InputField
      type="text"
      min="0"
      inputMode="decimal"
      pattern="\d*"
      value={wert}
      onChange={e => onNeuerWert(e.target.value)}
      maxLength={maxLength}
      id={id}
    ></InputField>
  )
}

const InputField = styled.input`
  width: 4.5rem;
  text-align: center;
  margin: 0 8px;
`
