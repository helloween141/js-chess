import {
  CELL_SIZE,
  CELL_BORDER_COLOR,
  CELL_SELECT_COLOR,
  CELL_HIGHLIGHT_COLOR,
} from './global'
import Konva from 'konva'

class Cell {
  constructor(x, y, color, figure) {
    this.x = x
    this.y = y
    this.color = color
    this.figure = figure
    this.isSelect = false
    this.isHighlight = false

    this.shape = new Konva.Rect({
      width: CELL_SIZE,
      height: CELL_SIZE,
      x: x * CELL_SIZE + 30,
      y: y * CELL_SIZE + 30,
      fill: color,
      stroke: CELL_BORDER_COLOR,
    })
  }

  /*
    Получить форму ячейки
  */
  getShape() {
    if (this.isSelect) {
      this.shape.attrs.fill = CELL_SELECT_COLOR
    } else if (this.isHighlight) {
      this.shape.attrs.fill = CELL_HIGHLIGHT_COLOR
    } else {
      this.shape.attrs.fill = this.color
    }
    return this.shape
  }
  
  /*
    Получить фигуру на ячейке
  */
  getFigure() {
    return this.figure
  }

  /*
    Установить подсветку возможных ходов
  */
  setHighlight() {
    this.isHighlight = true
  }

  /*
    Установить подсветку выбранной ячейки
  */
  setSelect() {
    this.isSelect = true
  }
}

export default Cell
