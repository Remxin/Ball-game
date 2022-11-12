import Board from "./classes/Board"

// export let board = undefined

export const board = new Board()

function startGame() {
    board.randomPlaceBalls()
}

startGame()