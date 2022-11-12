import config from "../config";
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
    public ballSelected: { is: boolean, field?: Field }
    pathFinding: { todoArr: pathFindingTodoArrType, check: boolean, startField?: Field }

    constructor() {
        this.fields = []
        this.ballSelected = { is: false, field: null }
        this.pathFinding = { todoArr: [], check: true, startField: null }
        this.showBoard() 
    }

    showBoard() {
        for (let i = 0 ; i < config.board.height; i++) {
            for (let j = 0; j < config.board.width; j++) {
                const field = new Field(j, i)
                this.fields.push(field)
            }
        }
    }

    randomPlaceBalls() {
        let freeFields

        for (let i = 0; i < config.balls.quantityPerRound; i++) {
            freeFields = this.fields.filter((f) => f.canPlace) // only blank fields
            const randColor = Math.floor(Math.random() * 6.99)
            const randomField = Math.floor(Math.random() * (freeFields.length - 0.01))

            const color = config.balls.colors[randColor]
            const field = freeFields[randomField]

            field.placeBall(color)
            field.canPlace = false
        }
    }

    resetPathFinding() {
        this.pathFinding = { todoArr: [], check: true}
        for (let field of this.fields) {
            field.pathFinding = { searchVal: -1, canTrack: true}
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
                field.highlight()
                this.pathFinding.startField.highlight()
                this.pathFinding = { todoArr: [], check: false }
                this.highlightPath(desiredPos)
                return
            }    
            if (!field.canPlace || !field.pathFinding.canTrack) continue
         
            field.pathFinding.canTrack = false
            field.pathFinding.searchVal = currIteration

            field.insertNum(currIteration) // TODO: delete this line if pathfinding works
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
        goes.highlight()
        if (goes.pathFinding.searchVal !== 1) this.highlightPath(goes.position)
        
        

    }


}

export default Board