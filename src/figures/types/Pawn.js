import Figure from '../../Figure'

class Pawn extends Figure {
  constructor(name, color, sprite) {
    super()
    this.name = name
    this.color = color
    this.image = this.createImage(sprite)
  }

  getMoves(cells, excluded = [], checkAttack = false) {
    const sign = this.color === 'black' ? 1 : -1
    let { x, y } = this.getPositionPoint()
    let result = []
    
    // Движение
    if (!checkAttack) {
      if (this.canMove(x, y + 1 * sign, cells) && !cells[y + 1 * sign][x].figure) {
        result.push([x, y + 1 * sign])
        
        if ((y === 1 || y === 6) && this.canMove(x, y + 2 * sign, cells) && !cells[y + 2 * sign][x].figure) {
          result.push([x, y + 2 * sign])
        }
      }
    }


    // Рубка по правой диагонали
    if (
      (this.canMove(x + 1 * sign, y + 1 * sign, cells) &&
      cells[y + 1 * sign][x + 1 * sign].figure &&
      cells[y + 1 * sign][x + 1 * sign].figure.color !== this.color) || checkAttack
    ) {
      result.push([x + 1 * sign, y + 1 * sign])
    }

    // Рубка по левой диагонали
    if (
      (this.canMove(x - 1 * sign, y + 1 * sign, cells) &&
      cells[y + 1 * sign][x - 1 * sign].figure &&
      cells[y + 1 * sign][x - 1 * sign].figure.color !== this.color) || checkAttack
    ) {
      result.push([x - 1 * sign, y + 1 * sign])
    }

    return result
  }

  getCropPosition() {
    return {
      x: 320,
      y: this.color === 'black' ? 0 : 64,
    }
  }
}

export default Pawn
