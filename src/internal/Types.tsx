export type Difficulty = 0 | 1 | 2 | 3 | 4 | 5

export type Exercise = {
    startAngle: number
    expectedAngle: number
}

export type Answer = {
    angle: number
}

export enum Result {
    Correct,
    Almost,
    Wrong
}
