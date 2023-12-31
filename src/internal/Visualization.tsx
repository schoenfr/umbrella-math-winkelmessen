import { useRef } from "react"
import SetSquare from "./SetSquare"
import DraggingController, { CanvasItem } from "./DraggingController"
import AnimatedCanvas from "./AnimatedCanvas"
import { Exercise } from "./Types"

type Props = {
    exercise: Exercise,
    drawingColor?: string,
    setSquareColor?: string
}

export default function Visualization({ exercise, drawingColor = "#006d77", setSquareColor = "#83c5be" }: Props) {
    const setSquare = useRef(new CanvasItem())
    const { startAngle, expectedAngle } = exercise

    const draw = (context: CanvasRenderingContext2D) => {
        const { width, height } = context.canvas

        context.save()
        clearScreen()
        context.translate(width / 2, height / 2) // move to the center of the canvas
        drawWinkel()
        drawSetSquare()
        context.restore()

        function clearScreen() {
            context.clearRect(0, 0, width, height)
//            context.strokeRect(0, 0, width, height)
        }

        function drawWinkel() {
            context.save()

            context.scale(1, -1) // invert y axis

            const fromAngle = startAngle * (Math.PI / 180)
            const toAngle = (startAngle + expectedAngle) * (Math.PI / 180)

            // Zwei Linien, die vom Mittelpunkt wegführen
            const r = 300
            const vector1 = [Math.cos(fromAngle) * r, Math.sin(fromAngle) * r]
            const vector2 = [Math.cos(toAngle) * r, Math.sin(toAngle) * r]
            context.beginPath()
            context.strokeStyle = drawingColor
            context.lineWidth = 2
            context.moveTo(0, 0)
            context.lineTo(vector1[0], vector1[1])
            context.moveTo(0, 0)
            context.lineTo(vector2[0], vector2[1])
            context.stroke()
            context.closePath()

            context.beginPath()
            context.fillStyle = setSquareColor
            context.globalAlpha = 0.4
            context.arc(0, 0, 50, fromAngle, toAngle)
            context.lineTo(0, 0)
            context.fill()
            context.closePath()

            context.restore()
        }

        function drawSetSquare() {
            context.save()

            context.setTransform(
                context
                    .getTransform()
                    // Transformation vom Dragging-Controller anwenden
                    .multiply(setSquare.current.transform)
                    // Realistische Größe wäre eine Skalierung mit 1.6, aber mit 0.9 sieht es erstmal besser aus
                    .scale(0.9, 0.9)
            )

            // Hintergrundfarbe des Geodreiecks
            context.save()
            context.beginPath()
            context.fillStyle = setSquareColor
            context.globalAlpha = 0.2
            context.moveTo(-300, 0)
            context.lineTo(300, 0)
            context.lineTo(0, -300)
            context.fill()
            context.closePath()
            context.restore()

            // Linien des Geodreiecks
            context.drawImage(SetSquare, -302, -301)

            context.restore()
        }
    }

    if (draw) {
        return (
            <DraggingController items={[setSquare.current]}>
                <AnimatedCanvas onDraw={draw} />
            </DraggingController>
        )
    }
    return <div></div>
}
