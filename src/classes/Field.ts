import config, { colorsType} from "../config"
import { board } from "../main"

/**
 * @param x Defines field X position index
 * @param y Defines field Y position index
 * @param pathFinding defines if field can be tracked by board pathfinding and searchVal defines how close it is to source destination (-1 means it is too far or other fields are much closer)
 * @param canPlace defines if user can place a ball on this field (false if on the field exists another ball)
 * @method onmouseDown tells board that this field is our start field from which it will be calculated pathfinding algorithm
 * @method onmouseenter tells board to which field it must calculate pathfinding algorithm
 * @method onmouseleave tells board to reset pathfinding algorithm except the start field
 * @method onmouseup tells board to move ball to end field and remove it from the start field 
 * @returns By default it creates field Div and appends it to game div
 */




class Field {
    div: HTMLDivElement
    position: { x: number, y: number }
    canPlace: boolean
    ballCollor: colorsType | null
    pathFinding: { canTrack: boolean, searchVal: number }
    p: HTMLParagraphElement
    
    
    constructor(x: number, y: number) {
        this.position = { x, y}
        this.div = document.createElement("div")
        this.canPlace = true
        this.pathFinding = { canTrack: true, searchVal: -1}
        this.ballCollor = null
        this.p = null

        this.div.classList.add("field")
        this.div.onpointerdown = () => this.onmouseDown()
        this.div.onpointerenter = () => this.onmouseenter()
        this.div.onpointerleave = () => this.onmouseleave()
        this.div.onpointerup = () => this.onmouseup()
        config.board.div.appendChild(this.div)
    }

    onmouseDown() {
        if (!this.ballCollor || board.locked) return
        board.ballSelected = { is: true, field: this}
    }

    onmouseenter() {
        if(!board.ballSelected.is || !this.canPlace || board.locked) return
        this.pathFinding = { canTrack: false, searchVal: -1 } // TODO: warning on this
        board.findPath(board.ballSelected.field.position, this.position, 1)
        
        
    }
    
    onmouseleave() {
        if (!board.locked) board.resetPathFinding()
    }

    onmouseup() {
        if (board.locked) return
        if (!board.pathFinding.found) {
            board.resetPathFinding()
            board.ballSelected.is = false
            board.locked = false
            return
        }
        board.ballSelected.color = board.ballSelected.field.ballCollor
        board.ballSelected.is = false
        board.locked = true
        board.shadePath()

        
        setTimeout(() => {
            this.placeBall(board.ballSelected.color)
            this.canPlace = false
            board.ballSelected.field.canPlace = true
            board.ballSelected.field.ballCollor = null
            
            // reset board and unlock
            board.resetPathFinding()
            board.pathFinding.startField = null
            
            
            // clear previos field
            board.ballSelected.field.clearDiv()
            board.ballSelected.field = null
            board.locked = false

            // start another turn
            board.nextTurn()
        }, config.board.placeBallDelay)

    }

    placeBall(color: colorsType) {
        if (this.ballCollor) return
        const ball = document.createElement('div')
        ball.classList.add("ball")

        const colorValue = config.balls.colorsMap.find((c) => c.key === color).value
        ball.style.backgroundColor = colorValue
        this.ballCollor = color

        this.div.appendChild(ball)
    }

    clearDiv() {
        this.div.innerHTML = ""
    }


    highlight() {
        this.div.style.backgroundColor = "red"
    }
    
    shadeHighlight() {
        this.div.style.backgroundColor = "#ff000055"
    }

    unhighlight() {
        this.div.style.backgroundColor = "transparent"
    }
}


export default Field