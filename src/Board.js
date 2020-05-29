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
import Spot from './Spot'
import FigureFactory from './figures/FigureFactory'

class Board {
  constructor() {
    this.cellsLayer = new Konva.Layer()
    this.figuresLayer = new Konva.Layer()
    this.animLayer = new Konva.Layer()
    
    this.cells = new Array(BOARD_CELLS_COUNT).fill(null).map(() => new Array(BOARD_CELLS_COUNT).fill(null))
    this.selectedFigure = null

    this.figuresSprite = new Image()
    this.figuresSprite.src = `./src/assets/${FIGURES_SPRITE_NAME}`
    this.figuresSprite.onload = () => {
      this.initialize()
    }    
  }

  initialize() {
    const defaultGameField = [
      ['_R', '_N', '_B', '_Q', '_K', '_B', '_N', '_R'],
      ['_P', '_P', '_P', '_P', '_P', '_P', '_P', '_P'],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
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
          this.cells[i][j] = new Spot(j, i, cellColor, figure)
        } else {
          this.cells[i][j] = new Spot(j, i, cellColor, null)
        }
      }
    }
  }

  selectSpot(posX, posY, playerColor) {
    if (posX >= 0 && posX < BOARD_CELLS_COUNT && posY >= 0 && posY < BOARD_CELLS_COUNT) {

      for (let i = 0; i < BOARD_CELLS_COUNT; i++) {
        for (let j = 0; j < BOARD_CELLS_COUNT; j++) {
          this.cells[i][j].isSelected = false
        }
      }

      const selectedSpot = this.cells[posY][posX]
      let moves = []

      // Если фигура была уже выбрана, либо есть возможность срубить
      if (this.selectedFigure && (!selectedSpot.figure || selectedSpot.figure.color !== playerColor)) {
        return this.selectedFigure
      }
      // Иначе подсветка возможных ходов
      else if (selectedSpot.figure && playerColor === selectedSpot.figure.color) {
        this.selectedFigure = selectedSpot.figure    
        moves = selectedSpot.figure.getMoves(this.cells)
        moves.forEach(move => this.cells[move[1]][move[0]].highlight())  
      }
    }

    return null
  }

  updateMove(move, endMoveCallback) {
    if (this.selectedFigure) {

      this.selectedFigure.endPosPoint = {
        x: move.endX,
        y: move.endY
      }
      this.selectedFigure.endPosPixels = {
        x: CELL_SIZE / 2 + move.endX * CELL_SIZE - 2,
        y: CELL_SIZE / 2 + move.endY * CELL_SIZE - 2
      }
      this.selectedFigure.moveVector = {
        x: this.selectedFigure.getImage().attrs.x > this.selectedFigure.endPosPixels.x ? -1 : 1,
        y: this.selectedFigure.getImage().attrs.y > this.selectedFigure.endPosPixels.y ? -1 : 1
      }

      this.selectedFigure.updateMoveAnimation(figure => {
        // Если пешка дошла до противоположного конца, то она превращается в ферзя
        if (figure.name === 'P' && (figure.endPosPoint.y === 0 || figure.endPosPoint.y === (BOARD_CELLS_COUNT - 1))) {
            figure = FigureFactory.create({
              name: 'Q',
              color: figure.color,
              sprite: this.figuresSprite
            })
        }
          
        if (figure.name === 'K') {
            this.canCastling = false
        }

        this.cells[this.selectedFigure.endPosPoint.y][this.selectedFigure.endPosPoint.x].figure = figure
        this.cells[this.selectedFigure.y][this.selectedFigure.x].figure = null
        figure.setPositionPoint(this.selectedFigure.endPosPoint.x, this.selectedFigure.endPosPoint.y)

        this.selectedFigure = null

        endMoveCallback(true)
      })
    }
  }

  _drawLabels(i) {
    const half = Math.round(CELL_SIZE / 2)
    const pos = i * CELL_SIZE

    let numerationLeftLabel = this._addLabel(
      5,
      20 + half + pos,
      i + 1
    )

    let numerationRightLabel = this._addLabel(
      STAGE_WIDTH - 20,
      20 + half + pos,
      BOARD_CELLS_COUNT - i
    )

    let numerationTopLabel = this._addLabel(
      20 + half + pos,
      0,
      String.fromCharCode(97 + i)
    )

    let numerationBottomLabel = this._addLabel(
      20 + half + pos,
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
      rotation: rotation,
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
          this.cellsLayer.add(cell.getCellShape())
  
          if (cell.figure) {
            this.figuresLayer.add(cell.getFigureShape())
          }
        }
      }
      this._drawLabels(i)
    }

    if (this.animationFigure) {
      this.animLayer.add(this.selectedFigure.image)
    }
    
  }
}

export default Board
