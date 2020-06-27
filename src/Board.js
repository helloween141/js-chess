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

    this.cells = new Array(BOARD_CELLS_COUNT).fill(null).map(() => new Array(BOARD_CELLS_COUNT).fill(null))

    this.figuresSprite = new Image()
    this.figuresSprite.src = `./assets/${FIGURES_SPRITE_NAME}`
    this.figuresSprite.onload = () => {
      this.initialize()
    }    
  }

  /*
    Инициализация игрового поля
  */
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

    let oddColor
    let evenColor

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

  /*
    Получить фигуры по цвету
    @color - цвет (white, black)
  */
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

  /*
    Выбрать ячейку
    @posX - позиция по X
    @posY - позиция по Y
  */
  selectCell(posX, posY) {
    if (posX >= 0 && posX < BOARD_CELLS_COUNT && posY >= 0 && posY < BOARD_CELLS_COUNT) {
      this.clearSelection()
      return this.cells[posY][posX] 
    } else {
      return null
    } 
  }

  /*
    Получить слепок игрового поля (в текстовом виде)
  */
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

  /*
    Очистить подсветку клеток
  */
  clearSelection() {
    for (let i = 0; i < BOARD_CELLS_COUNT; i++) {
      for (let j = 0; j < BOARD_CELLS_COUNT; j++) {
        this.cells[i][j].isSelect = false
        this.cells[i][j].isHighlight = false
      }
    }
  }

  /*
    Обновить перемещение фигуры
    @move - объект хода
  */
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
             
        this.cells[move.endPosPointer.y][move.endPosPointer.x].figure = figure
        this.cells[move.startPosPointer.y][move.startPosPointer.x].figure = null

        // Если фигура является королем или ладьей, то рокировка для короля невозможна
        if (figure.name === 'K' || figure.name === 'R') {
          figure.canCastling = false
          
          if (figure.name === 'K') {
            if (move.startPosPointer.x + 2 === move.endPosPointer.x) {
              const rookFigure = this.cells[move.endPosPointer.y][BOARD_CELLS_COUNT - 1].figure
              this.cells[move.endPosPointer.y][move.endPosPointer.x - 1].figure = rookFigure
              this.cells[move.endPosPointer.y][BOARD_CELLS_COUNT - 1].figure = null

              rookFigure.setPositionPoint(move.endPosPointer.x - 1, move.endPosPointer.y)
            }

            if (move.startPosPointer.x - 2 === move.endPosPointer.x) {
              const rookFigure = this.cells[move.endPosPointer.y][0].figure
              this.cells[move.endPosPointer.y][move.endPosPointer.x + 1].figure = rookFigure
              this.cells[move.endPosPointer.y][0].figure = null

              rookFigure.setPositionPoint(move.endPosPointer.x + 1, move.endPosPointer.y)
            }
            
          }
        }


        resolve(true)
      })
    })
  }
  
  /*
    Отрисовать подписи клеток
    @i - номер клетки
  */
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

  /*
    Добавить подпись
    @posX - позиция подписи X
    @posY - позиция подписи Y
    @text - текст
  */
  _addLabel(posX, posY, text) {
    return new Konva.Text({
      x: posX,
      y: posY,
      text: text,
      fontSize: 25,
      fontFamily: 'Calibri',
      fill: LABEL_COLOR
    })
  }

  /*
    Отрисовать игровое поле
  */
  render() {
    this.figuresLayer.removeChildren()
    this.cellsLayer.removeChildren()
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
