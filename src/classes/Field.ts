import config, { colorsType} from "../config"
import { board } from "../main"

class Field {
    div: HTMLDivElement
    position: { x: number, y: number }
    canPlace: boolean
    ballColor: colorsType | null
    pathFinding: { canTrack: boolean, searchVal: number }



    constructor(x: number, y: number) {
        this.position = { x, y}
        this.div= document.createElement("div")
        this.canPlace = true
        this.pathFinding = { canTrack: true, searchVal: -1}
        this.ballColor = null

        this.div.classList.add("field")
        this.div.onmousedown = () => this.onmouseDown()
        this.div.onmousedown = () => this.onmouseDown()
        config.board.div.appendChild(this.div)
    }

    onmouseDown() {
        if (!this.ballColor) return
        board.ballSelected = { is: true, field: this}
        board.pathFinding.startField = this
    }

    onmouseenter() {
        if(!board.ballSelected.is || !this.canPlace) return
        // board.resetPathFinding()
        this.pathFinding = { canTrack: false, searchVal: -1 } // TODO: warning on this
        board.findPath(board.ballSelected.field.position, this.position, 1)
    }

    placeBall(color: colorsType) {
        const ball = document.createElement('div')
        ball.classList.add("ball")

        const colorValue = config.balls.colorsMap.find((c) => c.key === color).value
        ball.style.backgroundColor = colorValue
        this.ballColor = color

        this.div.appendChild(ball)
    }

    clearDiv() {
        this.div.innerHTML = ""
    }

    insertNum(num: number) {
        this.div.innerHTML = num + ""
    }

    highlight() {
        this.div.style.backgroundColor = "red"
    }

    unhighlight() {
        this.div.style.backgroundColor = "transparent"
    }
}


export default Field