import {
  BOARD_CELLS_COUNT,
  CELL_FIRST_COLOR,
  CELL_SECOND_COLOR,
  CELL_SIZE,
  STAGE_HEIGHT,
  STAGE_WIDTH,
  LABEL_COLOR,
  FIGURES_SPRITE_NAME
} from './global'
import Konva from 'konva'
import Cell from './Cell'
import FigureFactory from './figures/FigureFactory'

class Board {
  constructor() {
    this.cellsLayer = new Konva.Layer()
    this.figuresLayer = new Konva.Layer()
    this.animLayer = new Konva.Layer()
    
    this.cells = new Array(BOARD_CELLS_COUNT).fill(null).map(() => new Array(BOARD_CELLS_COUNT).fill(null))

    this.figuresSprite = new Image()
    this.figuresSprite.src = `./src/assets/${FIGURES_SPRITE_NAME}`
    this.figuresSprite.onload = () => {
      this.initialize()
    }    
  }

  initialize() {
    const defaultGameField = [
      ['_R', '_N', '_B', '', '_K', '_B', '_N', ''],
      ['_P', '_P', '_P', '_P', '_P', '_P', '_P', '_P'],
      ['', '', '', '', '', '_Q', '_P', ''],
      ['', '', '', '', '', '', '_P', 'K'],
      ['', '', '', '', '', '', '_P', ''],
      ['', '', '', '', '', '', '_Q', '_R'],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'Q', '', 'B', 'N', 'R']
    ]

    let oddColor, evenColor

    for (let i = 0; i < BOARD_CELLS_COUNT; i++) {
      if (i % 2) {
        oddColor = CELL_FIRST_COLOR
        evenColor = CELL_SECOND_COLOR
      } else {
        oddColor = CELL_SECOND_COLOR
        evenColor = CELL_FIRST_COLOR
      }
      for (let j = 0; j < BOARD_CELLS_COUNT; j++) {
        const cellValue = defaultGameField[i][j]
        const cellColor = j % 2 ? oddColor : evenColor

        if (cellValue) {
          let figure = FigureFactory.create({
            name: cellValue[0] === '_' ? cellValue[1] : cellValue,
            color: cellValue[0] === '_' ? 'black' : 'white',
            sprite: this.figuresSprite
          })
          figure.setPositionPoint(j, i)
          this.cells[i][j] = new Cell(j, i, cellColor, figure)
        } else {
          this.cells[i][j] = new Cell(j, i, cellColor, null)
        }
      }
    }

  }

  getFiguresByColor(color) {
    const result = []
    for (let i = 0; i < BOARD_CELLS_COUNT; i++) {
      for (let j = 0; j < BOARD_CELLS_COUNT; j++) {
        const figure = this.cells[i][j].figure
        if (figure && figure.color === color) {
          result.push(figure)
        }
      }
    }
    return result
  }

  // Выбрать ячейку
  selectCell(posX, posY) {
    if (posX >= 0 && posX < BOARD_CELLS_COUNT && posY >= 0 && posY < BOARD_CELLS_COUNT) {
      this.clearSelection()
      return this.cells[posY][posX] 
    } else {
      return null
    } 
  }

  getSnapshot() {
    let snapshot = []
    for (let i = 0; i < BOARD_CELLS_COUNT; i++) {
      snapshot.push([])
      for (let j = 0; j < BOARD_CELLS_COUNT; j++) {
        const figure = this.cells[i][j].getFigure()
        snapshot[i].push(figure ? (figure.color === 'black' ? '_' : '') + figure.name : '')
      }
    }  
    return snapshot
  }

  // Убрать подсветку
  clearSelection() {
    for (let i = 0; i < BOARD_CELLS_COUNT; i++) {
      for (let j = 0; j < BOARD_CELLS_COUNT; j++) {
        this.cells[i][j].isSelect = false
        this.cells[i][j].isHighlight = false
      }
    }
  }

  updateMove(move) {
    return new Promise(resolve => {
      // Окончание анимации
      move.runAnimation().then(figure => {
      // Если пешка дошла до противоположного конца, то она превращается в ферзя
        if (figure.name === 'P' && (move.endPosPointer.y === 0 || move.endPosPointer.y === (BOARD_CELLS_COUNT - 1))) {
          figure = FigureFactory.create({
            name: 'Q',
            color: figure.color,
            sprite: this.figuresSprite
          })
          figure.setPositionPoint(move.endPosPointer.x, move.endPosPointer.y)
        }
            
        if (figure.name === 'K') {
          this.canCastling = false
        }
     
        this.cells[move.endPosPointer.y][move.endPosPointer.x].figure = figure
        this.cells[move.startPosPointer.y][move.startPosPointer.x].figure = null

        resolve(true)
      })
    })
  }

  _drawLabels(i) {
    const middleOffset = Math.round(CELL_SIZE / 2) + (i * CELL_SIZE) + 20

    const numerationLeftLabel = this._addLabel(
      5,
      middleOffset,
      i + 1
    )

    const numerationRightLabel = this._addLabel(
      STAGE_WIDTH - 20,
      middleOffset,
      BOARD_CELLS_COUNT - i
    )

    const numerationTopLabel = this._addLabel(
      middleOffset,
      0,
      String.fromCharCode(97 + i)
    )

    const numerationBottomLabel = this._addLabel(
      middleOffset,
      STAGE_HEIGHT - 25,
      String.fromCharCode(97 + i)
    )

    this.cellsLayer.add(
      numerationLeftLabel,
      numerationRightLabel,
      numerationTopLabel,
      numerationBottomLabel
    )
  }

  _addLabel(posX, posY, text, rotation = 1) {
    return new Konva.Text({
      x: posX,
      y: posY,
      text: text,
      fontSize: 25,
      fontFamily: 'Calibri',
      fill: LABEL_COLOR,
      rotation: rotation
    })
  }

  render() {
    this.figuresLayer.removeChildren()
    this.cellsLayer.removeChildren()
    this.animLayer.removeChildren()
    
    for (let i = 0; i < BOARD_CELLS_COUNT; i++) {
      for (let j = 0; j < BOARD_CELLS_COUNT; j++) {
        let cell = this.cells[i][j]
        if (cell) {
          this.cellsLayer.add(cell.getShape())
  
          if (cell.figure) {
            this.figuresLayer.add(cell.getFigure().getShape())
          }
        }
      }
      this._drawLabels(i)
    }
  }
}

export default Board
