import styled from 'styled-components'
import { CanvasHTMLAttributes, useEffect, useRef } from 'react'

type Props = {
  onDraw: DrawingFunction
} & CanvasHTMLAttributes<HTMLCanvasElement>

type DrawingFunction = (
  context: CanvasRenderingContext2D,
  elapsed: number
) => void

type AnimationStatus = {
  frameRequestId: number
  startTimestamp: number
  lastTimestamp: number
}

export default function AnimatedCanvas({ onDraw, ...props }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const animation = useRef<AnimationStatus>({
    frameRequestId: NaN,
    startTimestamp: NaN,
    lastTimestamp: NaN,
  })

  const start = requestFrame

  // Whenever the onDraw method changes, we restart the animation loop
  useEffect(() => {
    start()
    return stop
  }, [onDraw, start])

  function requestFrame() {
    animation.current.frameRequestId = window.requestAnimationFrame(loop)
  }

  function stop() {
    window.cancelAnimationFrame(animation.current.frameRequestId)
  }

  function loop(timestamp: number) {
    animation.current.startTimestamp ||= timestamp
    animation.current.lastTimestamp ||= timestamp
    tick(timestamp - animation.current.startTimestamp)
    animation.current.lastTimestamp = timestamp
    requestFrame()
  }

  function tick(elapsed: number) {
    const context = canvasRef?.current?.getContext('2d')
    if (context) {
      resize(context.canvas)
      onDraw(context, elapsed)
    }
  }

  function resize(canvas: HTMLCanvasElement) {
    if (
      canvas.width !== canvas.clientWidth ||
      canvas.height !== canvas.clientHeight
    ) {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }
  }

  return <Canvas ref={canvasRef} {...props}></Canvas>
}

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
  touch-action: none;
`
