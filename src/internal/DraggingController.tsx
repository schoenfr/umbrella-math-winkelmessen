import React, { MouseEvent, TouchEvent, useRef, WheelEvent } from 'react'
import styled from 'styled-components'

export class CanvasItem {
  transform: DOMMatrix

  constructor() {
    this.transform = new DOMMatrix()
  }
}

type DraggedItem = {
  item: CanvasItem
  originalTransform: DOMMatrix
}

interface Props {
  items: CanvasItem[]
  children: React.ReactNode
}

function clip(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v))
}

export default function DraggingController({ items, children }: Props) {
  const divRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef<{ dragging: boolean }>({ dragging: false })
  const touchRef = useRef<{
    touches: React.Touch[]
    initial: React.Touch[]
    transform: DOMMatrix
    items: DraggedItem[]
  }>({
    touches: [],
    initial: [],
    transform: new DOMMatrix(),
    items: [],
  })

  // the following functions are for moving items with mouse:

  function handleMouseDown(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault()
    mouseRef.current.dragging = true
  }

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    if (mouseRef.current.dragging) {
      items.forEach(item => {
        item.transform.e += event.nativeEvent.movementX
        item.transform.f += event.nativeEvent.movementY
        clipToCanvas(item.transform)
      })
    }
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    items.forEach(item => {
      item.transform ||= new DOMMatrix()
      const { a, b, c, d, e, f } = item.transform
      const rot = new DOMMatrix([a, b, c, d, 0, 0]).rotate(event.deltaY / 100)
      item.transform = new DOMMatrix().translate(e, f).multiply(rot)
    })
  }

  function handleMouseUp(event: MouseEvent<HTMLDivElement>) {
    mouseRef.current.dragging = false
  }

  function handleMouseEnter(event: MouseEvent<HTMLDivElement>) {
    // TODO: think about picking up the drag and drop where we left off (event.buttons === 1)
  }

  function handleMouseOut(event: MouseEvent<HTMLDivElement>) {
    // TODO: do we want to stop dragging when the mouse leaves the canvas? then mouseDragging = false
  }

  // the following functions are for moving items with touching:

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    updateTouchArray(event.touches)

    const touches = touchRef.current.touches
    if (touches.length === 1 || touches.length === 2) {
      touchRef.current.initial = touches
      touchRef.current.items = items.map(item => ({
        item: item,
        originalTransform: (item.transform || new DOMMatrix()).translate(0, 0),
      })) // Currently: drag all items, no filter
    }
  }

  function handleTouchMove(event: TouchEvent<HTMLDivElement>) {
    updateTouchArray(event.touches)

    const touches = touchRef.current.touches
    if (touches.length === 1) {
      const { x, y } = touchCoordinates(touches[0])
      const { x: initX, y: initY } = touchCoordinates(
        touchRef.current.initial[0]
      )
      touchRef.current.transform = new DOMMatrix().translate(
        x - initX,
        y - initY
      )
    } else if (touches.length === 2) {
      touchRef.current.transform = touchToMatrix(touches).multiply(
        touchToMatrix(touchRef.current.initial).inverse()
      )
    }

    touchRef.current.items.forEach(draggedItem => {
      draggedItem.item.transform = clipToCanvas(
        touchRef.current.transform.multiply(draggedItem.originalTransform)
      )
    })
  }

  function clipToCanvas(matrix: DOMMatrix) {
    if (divRef.current) {
      const { offsetWidth: width, offsetHeight: height } = divRef.current
      const padding = 5
      matrix.e = clip(matrix.e, -width / 2 + padding, width / 2 - padding)
      matrix.f = clip(matrix.f, -height / 2 + padding, height / 2 - padding)
    }
    return matrix
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    touchRef.current = {
      touches: [],
      initial: [],
      transform: new DOMMatrix(),
      items: [],
    }
  }

  function updateTouchArray(touches: React.TouchList) {
    touchRef.current.touches = Array.from(touches, (_, i) => i).map(i =>
      touches.item(i)
    )
  }

  function touchToMatrix(touches: React.Touch[]) {
    const { x: x0, y: y0 } = touchCoordinates(touches[0])
    const { x: x1, y: y1 } = touchCoordinates(touches[1])
    return new DOMMatrix()
      .translate((x0 + x1) / 2, (y0 + y1) / 2)
      .rotateFromVector(x1 - x0, y1 - y0)
  }

  function touchCoordinates(touch: React.Touch) {
    if (divRef.current) {
      const {
        offsetWidth: width,
        offsetHeight: height,
        offsetLeft: left,
        offsetTop: top,
      } = divRef.current
      return {
        x: touch.pageX - (left + width / 2),
        y: touch.pageY - (top + height / 2),
      }
    } else {
      return { x: 0, y: 0 }
    }
  }

  return (
    <FullSize
      ref={divRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseOut={handleMouseOut}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </FullSize>
  )
}

const FullSize = styled.figure`
  margin: 0;
  width: 100%;
  height: 100%;
`
