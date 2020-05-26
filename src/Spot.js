import { CELL_SIZE, CELL_BORDER_COLOR, CELL_SELECTOR_COLOR } from './global'
import Konva from 'konva'

class Spot {
  constructor(x, y, color, figure) {
    this.x = x
    this.y = y
    this.color = color
    this.figure = figure
    this.isSelected = false

    this.cell = new Konva.Rect({
      width: CELL_SIZE,
      height: CELL_SIZE,
      x: x * CELL_SIZE + 30,
      y: y * CELL_SIZE + 30,
      fill: color,
      stroke: 'CELL_BORDER_COLOR',
    })
  }

  getCellShape() {
    if (this.isSelected) {
      this.cell.attrs.fill = CELL_SELECTOR_COLOR
    } else {
      this.cell.attrs.fill = this.color
    }    
    return this.cell
  }

  getFigureShape() {
    return this.figure.getImage()
  }

  highlight() {
    this.isSelected = true
  }
}

export default Spot
