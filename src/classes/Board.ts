import config, { colorsType } from "../config";
import Field from "./Field";

type pathFindingTodoArrType = {
    pos: { x: number, y: number},
    num: number
}[]

interface boardInterface {
    fields: Field[]
}


class Board implements boardInterface{
    fields: Field[]
    public ballSelected: { is: boolean, field?: Field, color?: colorsType }
    pathFinding: { todoArr: pathFindingTodoArrType, check: boolean, startField?: Field, found: boolean }
    locked: boolean
    highlightedFields: Field[]
    nextBalls: colorsType[]

    constructor() {
        this.fields = []
        this.highlightedFields = []
        this.ballSelected = { is: false, field: null, color: null }
        this.pathFinding = { todoArr: [], check: true, startField: null, found: false }
        this.showBoard() 
        this.locked = false
        this.nextBalls = []
    }

    showBoard() {
        config.info.pointsSpan.innerText = "0"
        for (let i = 0 ; i < config.board.height; i++) {
            for (let j = 0; j < config.board.width; j++) {
                const field = new Field(j, i)
                this.fields.push(field)
            }
        }
    }

    getRandomColors() {
        this.nextBalls = []
        for (let i = 0; i < config.balls.quantityPerRound; i++) {
            const randColor = Math.floor(Math.random() * 6.99)
            const color = config.balls.colors[randColor]
            this.nextBalls.push(color)
        }
    }

    randomPlaceBalls() {
        if (this.nextBalls.length === 0) this.getRandomColors()
        let freeFields = this.fields.filter((f) => f.canPlace)

        if (freeFields.length < 3) return this.endGame()
        
        for (let i = 0; i < config.balls.quantityPerRound; i++) {
            freeFields = this.fields.filter((f) => f.canPlace) // only blank fields
            const randomField = Math.floor(Math.random() * (freeFields.length - 0.01))
            
            const field = freeFields[randomField]
            const color = this.nextBalls[i]

            field.placeBall(color)
            field.canPlace = false
        }

        this.getRandomColors()
        this.showNextColors()
    }

    showNextColors() {
        config.info.nextBallsDiv.innerHTML = ""

        for (let ballCollor of this.nextBalls) {
            const ballDiv = document.createElement("div")
            ballDiv.style.backgroundColor = config.balls.colorsMap.find(color => color.key === ballCollor).value
            ballDiv.classList.add("info-ball")

            config.info.nextBallsDiv.appendChild(ballDiv)
        }
    }

    resetPathFinding() {
        this.pathFinding = { todoArr: [], check: true, found: false}
        this.highlightedFields = []
        for (let field of this.fields) {
            field.pathFinding = { searchVal: -1, canTrack: true}
            field.unhighlight()
        }

    }

    findPath(startPos: { x: number, y: number }, desiredPos: { x: number, y: number }, currIteration: number ) {
        const surroundingFields = {
            top: this.fields.find((f) => {
                return f.position.x ===  startPos.x  && f.position.y === startPos.y - 1 
            }),

            bottom: this.fields.find((f) => {
                return f.position.x === startPos.x && f.position.y === startPos.y  + 1
            }),

            left: this.fields.find((f) => {
                return f.position.x === startPos.x - 1 && f.position.y === startPos.y
            }),

            right: this.fields.find((f) => {
                return f.position.x === startPos.x + 1 && f.position.y === startPos.y
            })
        }

        
        for (let field of Object.values(surroundingFields)) {
            if (!field) continue
            
            if (JSON.stringify(field.position) === JSON.stringify(desiredPos)) { // found desired field
                // highlight end and start position
                field?.highlight()
                this.ballSelected.field.highlight()
                this.highlightedFields.push(field, this.ballSelected.field)
                this.pathFinding = { todoArr: [], check: false, found: true }
                this.highlightPath(desiredPos)
                return
            }    
    
            if (!field.canPlace || !field.pathFinding.canTrack) continue
      
            
            field.pathFinding.canTrack = false
            field.pathFinding.searchVal = currIteration

            this.pathFinding.todoArr.push({pos: field.position, num: currIteration + 1})

        }
    
        this.pathFinding.todoArr.forEach((variation, i) => {
            setTimeout(() => {
                if (!this.pathFinding.check) return
                this.pathFinding.todoArr.splice(i, 1)
                this.findPath(variation.pos, desiredPos, variation.num)
            }, 0) // this doesn't work without timeout
        })
    }


    highlightPath(currentPos: { x: number, y: number}) {
        const surroundingFields = {
            top: this.fields.find((f) => {
                return f.position.x ===  currentPos.x  && f.position.y === currentPos.y - 1 
            }),

            bottom: this.fields.find((f) => {
                return f.position.x === currentPos.x && f.position.y === currentPos.y  + 1
            }),

            left: this.fields.find((f) => {
                return f.position.x === currentPos.x - 1 && f.position.y === currentPos.y
            }),

            right: this.fields.find((f) => {
                return f.position.x === currentPos.x + 1 && f.position.y === currentPos.y
            })
        }

        let goes = null

        for (let surroundField of Object.values(surroundingFields)) {
            if (!surroundField) continue
            if (!goes && surroundField.pathFinding.searchVal > 0) goes = surroundField

            if (surroundField.pathFinding.searchVal > 0 && surroundField.pathFinding.searchVal < goes.pathFinding.searchVal ) goes = surroundField
        }

        if (!goes) return
        this.highlightedFields.push(goes)
        goes.highlight()
        if (goes.pathFinding.searchVal !== 1) this.highlightPath(goes.position)
    }

    shadePath() {
        for (let field of this.highlightedFields) {
            field.shadeHighlight()
        }
    }

    checkBeating() {
        let tobeatArr = [] as Field[]
        let candidatesToBeatArr = [] as Field[]
  
        for (let i = 0; i < config.board.height; i++) { // horizontal beating
            for (let j = 0; j < config.board.width; j++) {
                const field = this.fields.find((f) => f.position.x === j && f.position.y === i)
                if (!field?.ballCollor) {
                    if (candidatesToBeatArr.length >= 4) tobeatArr.push(...candidatesToBeatArr)
                    candidatesToBeatArr = []
                    continue
                }

                if (candidatesToBeatArr.length > 0) { // combo stack
                    const lastField = candidatesToBeatArr[candidatesToBeatArr.length - 1]
                    if (field.ballCollor === lastField.ballCollor) candidatesToBeatArr.push(field)

                    else { 
                        if (candidatesToBeatArr.length >= 4) tobeatArr.push(...candidatesToBeatArr) // there was +4 combo, add balls to delete
                        candidatesToBeatArr = [field]
                    }
                } else {
                    candidatesToBeatArr.push(field)
                }
            }
            if (candidatesToBeatArr.length >= 4) {
                tobeatArr = [...candidatesToBeatArr]
                candidatesToBeatArr = []
            }
        }

       

        for (let i = 0; i < config.board.height; i++) { // vertical beating
            for (let j = 0; j < config.board.width; j++) {
                const field = this.fields.find((f) => f.position.x === i && f.position.y === j)
                if (!field?.ballCollor) {
                    if (candidatesToBeatArr.length >= 4) tobeatArr.push(...candidatesToBeatArr)
                    candidatesToBeatArr = []
                    continue
                }

                if (candidatesToBeatArr.length > 0) { // combo stack
                    const lastField = candidatesToBeatArr[candidatesToBeatArr.length - 1]
                    if (field.ballCollor === lastField.ballCollor) candidatesToBeatArr.push(field)

                    else { 
                        if (candidatesToBeatArr.length >= 4) tobeatArr.push(...candidatesToBeatArr) // there was +4 combo, add balls to delete
                        candidatesToBeatArr = [field]
                    }
                } else {
                    candidatesToBeatArr.push(field)
                }
            }
            if (candidatesToBeatArr.length >= 4) {
                tobeatArr = [...candidatesToBeatArr]
                candidatesToBeatArr = []
            }
    
        }

       
        for (let i = config.board.height - 4; i > -config.board.height + 3; i--) { // diagonal up beating
            for (let j = 0; j < config.board.width * 2; j++) { 
                const field = this.fields.find((f) => f.position.x === j && f.position.y === i + j)
                
                if (!field?.ballCollor) {
                    if (candidatesToBeatArr.length >= 4) tobeatArr.push(...candidatesToBeatArr)
                    candidatesToBeatArr = []
                    continue
                }
              

                if (candidatesToBeatArr.length > 0) { // combo stack
                    const lastField = candidatesToBeatArr[candidatesToBeatArr.length - 1]
                    
                    
                    if (field.ballCollor === lastField.ballCollor) candidatesToBeatArr.push(field)
                    else { 
                        
                        if (candidatesToBeatArr.length >= 4) tobeatArr.push(...candidatesToBeatArr) // there was +4 combo, add balls to delete
                        candidatesToBeatArr = [field]
                        
                    }
                } else {
                    
                    candidatesToBeatArr.push(field)
                }
            }
            if (candidatesToBeatArr.length >= 4) {
                tobeatArr = [...candidatesToBeatArr]
                candidatesToBeatArr = []
            }
        }

        for (let i = 3; i < config.board.height + 5; i++) { // diagonal down beating
            for (let j = 0; j < config.board.width * 2; j++) { 
                const field = this.fields.find((f) => f.position.x === j && f.position.y === i - j)
                if (!field?.ballCollor) {
                    if (candidatesToBeatArr.length >= 4) tobeatArr.push(...candidatesToBeatArr)
                    candidatesToBeatArr = []
                    continue
                }
              

                if (candidatesToBeatArr.length > 0) { // combo stack
                    const lastField = candidatesToBeatArr[candidatesToBeatArr.length - 1]
                    
                    
                    if (field.ballCollor === lastField.ballCollor) candidatesToBeatArr.push(field)
                    else { 
                        
                        if (candidatesToBeatArr.length >= 4) tobeatArr.push(...candidatesToBeatArr) // there was +4 combo, add balls to delete
                        candidatesToBeatArr = [field]
                        
                    }
                } else {
                    
                    candidatesToBeatArr.push(field)
                }
            }
            if (candidatesToBeatArr.length >= 4) {
                tobeatArr = [...candidatesToBeatArr]
                candidatesToBeatArr = []
            }
        }

        

        
        config.info.score += tobeatArr.length
        config.info.pointsSpan.innerText = config.info.score + ""
        for (let beatField of tobeatArr) { // perform beating
           beatField.canPlace = true
           beatField.ballCollor = null
           beatField.clearDiv()
        }

        return tobeatArr.length > 0
    }

    nextTurn() {
        const wasBeating = this.checkBeating()
        if (!wasBeating) this.randomPlaceBalls()
        
    }

    endGame() {
        const endDiv = document.createElement("div")
        endDiv.classList.add("end-div")

        const h1 = document.createElement("h1")
        h1.innerText = "Game over!"

        const p = document.createElement("p")
        p.innerText = "Your scrore: " + config.info.score

        const btn = document.createElement("button")
        btn.innerText = "Play again"
        btn.onclick = () => window.location.reload()

        endDiv.appendChild(h1)
        endDiv.appendChild(p)
        endDiv.appendChild(btn)

        document.getElementsByTagName("body")[0].appendChild(endDiv)
    }


}

export default Board