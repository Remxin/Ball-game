export type colorsType = "r" | "g" | "b" | "o" | "w" | "d" | "p"
interface colorsMapType {
    key: colorsType,
    value: string
}

interface boardInterface {
    div: HTMLDivElement,
    readonly height: number
    readonly width: number
    readonly placeBallDelay: number
}

interface ballsInterface {
    readonly quantityPerRound: number,
    readonly colors: colorsType[]
    readonly colorsMap: colorsMapType[]
}

export default {
    info: {
        pointsSpan: document.getElementById("points") as HTMLSpanElement,
        score: 0,
        nextBalls: [] as colorsType[],
        nextBallsDiv: document.getElementById("nextBalls") as HTMLDivElement
    },
    board: {
        div: document.getElementById("game") as HTMLDivElement,
        height: 9,
        width: 9,
        placeBallDelay: 1000
    } as boardInterface,

    balls: {
        quantityPerRound: 3,
        colors: ["r", "g", "b", "o", "w", "d", "p"],
        colorsMap: [
            {
                key: "r",
                value: "#d22"
            },
            {
                key: "g",
                value: "#2d2"
            },
            {
                key: "b",
                value: "#22d"
            },
            {
                key: "o",
                value: "#ffa500"
            },
            {
                key: "w",
                value: "#fff"
            },
            {
                key: "d",
                value: "#232323"
            },
            {
                key: "p",
                value: "#6a0dad"
            }

        ] 
    } as ballsInterface
}