import Board from "./classes/Board"

// export let board = undefined

/**
 * @returns creates new board and exports created object to other classes
 */

export const board = new Board()

function startGame() {
    board.randomPlaceBalls()
}

startGame()