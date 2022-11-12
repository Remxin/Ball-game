export type colorsType = "r" | "g" | "b" | "o" | "w" | "d" | "p"
type colorsMapType = {
    key: colorsType,
    value: string
}

export default {
    board: {
        div: document.getElementById("game") as HTMLDivElement,
        height: 9,
        width: 9,
        placeBallDelay: 1000
    },

    balls: {
        quantityPerRound: 3,
        colors: ["r", "g", "b", "o", "w", "d", "p"] as colorsType[],
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

        ]  as colorsMapType[]
    }
}