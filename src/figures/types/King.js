import Figure from '../../Figure'

class King extends Figure {
  constructor(name, color, sprite) {
    super()
    this.name = name
    this.color = color
    this.image = this.createImage(sprite)
    this.isShah = false
    this.canCastling = true // Возможность рокировки
  }

  getMoves(cells) {
    const sign = this.color === 'black' ? 1 : -1
    let { x, y } = this.getPositionPoint()
    let result = []

    if (this.canMove(x, y + 1 * sign, cells)) {
      result.push([x, y + 1 * sign])
    }

    if (this.canMove(x, y - 1 * sign, cells)) {
      result.push([x, y - 1 * sign])
    }

    if (this.canMove(x + 1 * sign, y, cells)) {
      result.push([x + 1 * sign, y])
    }

    if (this.canMove(x + 1 * sign, y + 1 * sign, cells)) {
      result.push([x + 1 * sign, y + 1 * sign])
    }

    if (this.canMove(x - 1 * sign, y - 1 * sign, cells)) {
      result.push([x - 1 * sign, y - 1 * sign])
    }

    if (this.canMove(x + 1 * sign, y - 1 * sign, cells)) {
      result.push([x + 1 * sign, y - 1 * sign])
    }

    if (this.canMove(x - 1 * sign, y + 1 * sign, cells)) {
      result.push([x - 1 * sign, y + 1 * sign])
    }

    if (this.canMove(x - 1 * sign, y, cells)) {
      result.push([x - 1 * sign, y])
    }

    if (this.canCastling && (this.canMove(x - 2 * sign, y, cells) || this.canMove(x + 2 * sign, y, cells))) {
      result.push([x - 1 * sign, y])
    }   

    if (this.canCastling) {
      if (this.canMove(x - 2 * sign, y, cells)) {
        result.push([x - 2 * sign, y])
      }

      if (this.canMove(x + 2 * sign, y, cells)) {
        result.push([x + 2 * sign, y])
      }      
    }   

    return result
  }

  getCropPosition() {
    return {
      x: 0,
      y: this.color === 'black' ? 0 : 64,
    }
  }
}

export default King
