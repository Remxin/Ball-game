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
    pathFinding: { todoArr: pathFindingTodoArrType, check: boolean, startField?: Field, found: boolean }
    locked: boolean
    highlightedFields: Field[]

    constructor() {
        this.fields = []
        this.highlightedFields = []
        this.ballSelected = { is: false, field: null }
        this.pathFinding = { todoArr: [], check: true, startField: null, found: false }
        this.showBoard() 
        this.locked = false
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
        this.pathFinding = { todoArr: [], check: true, found: false}
        this.highlightedFields = []
        // this.ballSelected = { is: false, field: null}
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
            console.group()
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
            console.groupEnd()
        }

        

        

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


}

export default Board