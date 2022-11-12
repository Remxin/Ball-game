import config, { colorsType} from "../config"
import { board } from "../main"

class Field {
    div: HTMLDivElement
    position: { x: number, y: number }
    canPlace: boolean
    ballCollor: colorsType | null
    pathFinding: { canTrack: boolean, searchVal: number }
    p: HTMLParagraphElement



    constructor(x: number, y: number) {
        this.position = { x, y}
        this.div= document.createElement("div")
        this.canPlace = true
        this.pathFinding = { canTrack: true, searchVal: -1}
        this.ballCollor = null
        this.p = null

        this.div.classList.add("field")
        this.div.onmousedown = () => this.onmouseDown()
        this.div.onmouseenter = () => this.onmouseenter()
        this.div.onmouseleave = () => this.onmouseleave()
        this.div.onmouseup = () => this.onmouseup()
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
        if (!board.pathFinding.found) return
        board.ballSelected.is = false
        board.locked = true
        board.shadePath()
        
        setTimeout(() => {
            this.placeBall(board.ballSelected.field.ballCollor)
            this.canPlace = false
            board.ballSelected.field.canPlace = true
            board.ballSelected.field.ballCollor = null
            
            // reset board and unlock
            board.resetPathFinding()
            board.pathFinding.startField = null
            board.locked = false
            
            // start another turn
            board.nextTurn()
            
            // clear previos field
            board.ballSelected.field.clearDiv()
            board.ballSelected.field = null
        }, config.board.placeBallDelay)

    }

    placeBall(color: colorsType) {
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