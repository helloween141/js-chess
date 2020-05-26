import Figure from '../../Figure'

class Knight extends Figure {
  constructor(name, color, sprite) {
    super()
    this.name = name
    this.color = color
    this.image = this.createImage(sprite)
  }

  getMoves(cells) {
    const sign = this.color === 'black' ? 1 : -1
    let { x, y } = this.getPositionPoint()
    let result = []

    if (this.canMove(x + 1 * sign, y + 2 * sign, cells)) {
      result.push([x + 1 * sign, y + 2 * sign])
    }

    if (this.canMove(x - 1 * sign, y + 2 * sign, cells)) {
      result.push([x - 1 * sign, y + 2 * sign])
    }

    if (this.canMove(x + 1 * sign, y - 2 * sign, cells)) {
      result.push([x + 1 * sign, y - 2 * sign])
    }

    if (this.canMove(x - 1 * sign, y - 2 * sign, cells)) {
      result.push([x - 1 * sign, y - 2 * sign])
    }

    return result
  }

  getCropPosition() {
    return {
      x: 192,
      y: this.color === 'black' ? 0 : 64,
    }
  }
}

export default Knight
